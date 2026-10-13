package com.foodrescue.scheduler;

import com.foodrescue.model.DonationStatus;
import com.foodrescue.model.FoodDonation;
import com.foodrescue.repository.FoodDonationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ExpiryScheduler {

    private static final Logger logger = LoggerFactory.getLogger(ExpiryScheduler.class);

    @Autowired
    private FoodDonationRepository donationRepository;

    /**
     * FR-2.6: Auto-marks donations as EXPIRED once best-before time passes
     * Runs every 60 seconds
     */
    @Scheduled(cron = "${app.scheduler.expiry-cron:0 * * * * *}")
    @Transactional
    public void processExpiredDonations() {
        LocalDateTime now = LocalDateTime.now();
        List<FoodDonation> expiredList = donationRepository.findByStatusAndExpiryTimeBefore(DonationStatus.AVAILABLE, now);

        if (!expiredList.isEmpty()) {
            logger.info("ExpiryScheduler: Found {} donations past expiry. Transitioning to EXPIRED.", expiredList.size());
            for (FoodDonation donation : expiredList) {
                donation.setStatus(DonationStatus.EXPIRED);
            }
            donationRepository.saveAll(expiredList);
        }
    }
}
