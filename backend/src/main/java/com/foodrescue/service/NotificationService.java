package com.foodrescue.service;

import com.foodrescue.model.FoodDonation;
import com.foodrescue.model.Ngo;
import com.foodrescue.model.Notification;
import com.foodrescue.model.User;
import com.foodrescue.repository.NgoRepository;
import com.foodrescue.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NgoRepository ngoRepository;

    @Transactional
    public Notification createNotification(User user, String title, String message) {
        Notification notification = new Notification(user, title, message);
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Transactional
    public void markAsRead(Long id, User user) {
        notificationRepository.findById(id).ifPresent(n -> {
            if (n.getUser().getId().equals(user.getId())) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        });
    }

    @Transactional
    public void notifyNearbyNgos(FoodDonation donation) {
        List<Ngo> verifiedNgos = ngoRepository.findByVerifiedTrue();
        for (Ngo ngo : verifiedNgos) {
            String title = "New Surplus Food Alert!";
            String message = String.format("A new donation of %s (%.1f kg, serves ~%d) is available near %s.",
                    donation.getFoodName(), donation.getQuantity(), donation.getPeopleServed(), donation.getLocation());
            createNotification(ngo.getUser(), title, message);
        }
    }
}
