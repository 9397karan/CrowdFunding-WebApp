package Backend.service;

import Backend.dto.CreatePaymentRequest;
import Backend.dto.VerifyPaymentRequest;

import java.util.Map;

public interface PaymentService {

    Map<String, Object> createOrder(CreatePaymentRequest request);

    Map<String, Object> verifyPayment(VerifyPaymentRequest request);
}