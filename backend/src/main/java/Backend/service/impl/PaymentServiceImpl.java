
package Backend.service.impl;

import Backend.dto.CreatePaymentRequest;
import Backend.dto.VerifyPaymentRequest;
import Backend.entity.*;
import Backend.repository.*;
import Backend.service.PaymentService;

import com.razorpay.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final RazorpayClient client;
    private final PaymentOrderRepository orderRepo;
    private final ProjectRepository projectRepo;
    private final UserRepository userRepo;
    private final ContributionRepository contributionRepo;
    private final String keyId, keySecret;

    public PaymentServiceImpl(
            @Value("${razorpay.key.id}") String keyId,
            @Value("${razorpay.key.secret}") String keySecret,
            PaymentOrderRepository orderRepo,
            ProjectRepository projectRepo,
            UserRepository userRepo,
            ContributionRepository contributionRepo) throws Exception {

        client = new RazorpayClient(keyId, keySecret);
        this.keyId = keyId;
        this.keySecret = keySecret;
        this.orderRepo = orderRepo;
        this.projectRepo = projectRepo;
        this.userRepo = userRepo;
        this.contributionRepo = contributionRepo;
    }

    @Override
    public Map<String, Object> createOrder(CreatePaymentRequest r) {
        if (r == null || r.getProjectId() == null || r.getUserId() == null
                || r.getAmountPaise() == null || r.getAmountPaise() < 100)
            throw new IllegalArgumentException("Invalid project, user or amount.");

        Project project = projectRepo.findById(r.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = userRepo.findById(r.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (project.getCreator() != null &&
                project.getCreator().getId().equals(user.getId()))
            throw new IllegalArgumentException("Cannot contribute to your own project.");

        try {
            JSONObject data = new JSONObject();
            data.put("amount", r.getAmountPaise());
            data.put("currency", "INR");
            data.put("receipt", "project_" + project.getId() + "_" + System.currentTimeMillis());

            Order order = client.orders.create(data);

            PaymentOrder po = new PaymentOrder();
            po.setRazorpayOrderId(order.get("id"));
            po.setProjectId(project.getId());
            po.setUserId(user.getId());
            po.setAmountPaise(r.getAmountPaise());
            po.setProcessed(false);
            orderRepo.save(po);

            return Map.of(
                    "orderId", order.get("id"),
                    "amount", r.getAmountPaise(),
                    "currency", "INR",
                    "keyId", keyId
            );
        } catch (Exception e) {
            throw new RuntimeException("Unable to create order: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public Map<String, Object> verifyPayment(VerifyPaymentRequest r) {
        if (r == null || r.getRazorpayOrderId() == null
                || r.getRazorpayPaymentId() == null
                || r.getRazorpaySignature() == null)
            throw new IllegalArgumentException("Payment details are required.");

        PaymentOrder po = orderRepo.findByRazorpayOrderId(r.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (po.isProcessed())
            throw new IllegalArgumentException("Order already processed.");

        try {
            JSONObject data = new JSONObject();
            data.put("razorpay_order_id", r.getRazorpayOrderId());
            data.put("razorpay_payment_id", r.getRazorpayPaymentId());
            data.put("razorpay_signature", r.getRazorpaySignature());
            Utils.verifyPaymentSignature(data, keySecret);

            Payment payment = client.payments.fetch(r.getRazorpayPaymentId());

            if (!r.getRazorpayOrderId().equals(payment.get("order_id")))
                throw new IllegalArgumentException("Order ID mismatch.");

            if (!"captured".equals(payment.get("status")))
                throw new IllegalArgumentException("Payment not captured.");

            Object amount = payment.get("amount");
            if (!(amount instanceof Number)
                    || ((Number) amount).longValue() != po.getAmountPaise().longValue())
                throw new IllegalArgumentException("Payment amount does not match the order.");

            Project project = projectRepo.findById(po.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            User user = userRepo.findById(po.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            double donation = ((Number) amount).doubleValue() / 100.0;

            Contribution c = new Contribution();
            c.setProject(project);
            c.setUser(user);
            c.setAmount(donation);

            project.setCurrentAmount(
                    (project.getCurrentAmount() == null ? 0.0 : project.getCurrentAmount())
                            + donation);

            projectRepo.save(project);
            contributionRepo.save(c);
            po.setProcessed(true);
            orderRepo.save(po);

            return Map.of(
                    "message", "Payment verified successfully.",
                    "contributionId", c.getId()
            );
        } catch (Exception e) {
            throw new RuntimeException("Payment verification failed: " + e.getMessage(), e);
        }
    }
}
