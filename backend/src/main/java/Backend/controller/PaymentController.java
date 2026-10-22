
package Backend.controller;

import Backend.dto.CreatePaymentRequest;
import Backend.dto.VerifyPaymentRequest;
import Backend.service.PaymentService;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public Map<String, Object> createOrder(
            @RequestBody CreatePaymentRequest request
    ) {
        return paymentService.createOrder(request);
    }

    @PostMapping("/verify")
    public Map<String, Object> verifyPayment(
            @RequestBody VerifyPaymentRequest request
    ) {
        return paymentService.verifyPayment(request);
    }
}
