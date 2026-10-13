package com.foodrescue.config;

import com.foodrescue.model.*;
import com.foodrescue.repository.FoodDonationRepository;
import com.foodrescue.repository.NgoRepository;
import com.foodrescue.repository.PickupRepository;
import com.foodrescue.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NgoRepository ngoRepository;

    @Autowired
    private FoodDonationRepository donationRepository;

    @Autowired
    private PickupRepository pickupRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        System.out.println("Initializing Food Rescue sample data...");

        // 1. Admin
        User admin = new User(
                "Platform Admin",
                "admin@foodrescue.org",
                passwordEncoder.encode("admin123"),
                "9998887770",
                Role.ADMIN,
                "Lucknow Central Office",
                26.8467,
                80.9462
        );
        userRepository.save(admin);

        // 2. Rohit Verma (Wedding Organizer / Donor)
        User rohit = new User(
                "Rohit Verma (Wedding Organizer)",
                "rohit.wedding@lucknow.com",
                passwordEncoder.encode("password123"),
                "9876543210",
                Role.DONOR,
                "Awadh Convention Center, Gomti Nagar, Lucknow",
                26.8500,
                80.9990
        );
        userRepository.save(rohit);

        // 3. Hotel Grand Heritage (Another Donor)
        User hotelDonor = new User(
                "Grand Heritage Hotel & Banquet",
                "buffet@grandheritage.com",
                passwordEncoder.encode("password123"),
                "9811223344",
                Role.DONOR,
                "Vibhuti Khand, Gomti Nagar, Lucknow",
                26.8620,
                81.0020
        );
        userRepository.save(hotelDonor);

        // 4. Verified NGO - Hope Foundation
        User ngoHopeUser = new User(
                "Hope Foundation Lucknow",
                "ngo.hope@foodrescue.org",
                passwordEncoder.encode("password123"),
                "9876501234",
                Role.NGO,
                "Hazratganj Community Hall, Lucknow",
                26.8530,
                80.9460
        );
        userRepository.save(ngoHopeUser);

        Ngo hopeNgo = new Ngo(
                ngoHopeUser,
                "Hope Foundation Lucknow",
                "NGO-UP-2023-7841",
                "9876501234",
                "Hazratganj Community Hall, Lucknow",
                true // Verified by admin
        );
        ngoRepository.save(hopeNgo);

        // 5. Unverified NGO (Pending Verification) - Care & Share Trust
        User ngoCareUser = new User(
                "Care & Share Shelter Trust",
                "ngo.care@foodrescue.org",
                passwordEncoder.encode("password123"),
                "9822334455",
                Role.NGO,
                "Alambagh Shelter Home, Lucknow",
                26.8150,
                80.9020
        );
        userRepository.save(ngoCareUser);

        Ngo careNgo = new Ngo(
                ngoCareUser,
                "Care & Share Shelter Trust",
                "NGO-UP-2024-9912",
                "9822334455",
                "Alambagh Shelter Home, Lucknow",
                false // Pending verification
        );
        ngoRepository.save(careNgo);

        // 6. Volunteer - Amit Kumar
        User amitVolunteer = new User(
                "Amit Kumar",
                "amit.volunteer@foodrescue.org",
                passwordEncoder.encode("password123"),
                "9712345678",
                Role.VOLUNTEER,
                "Indira Nagar Sector 14, Lucknow",
                26.8820,
                80.9910
        );
        userRepository.save(amitVolunteer);

        // 7. Seed Worked Example: Rohit's Lucknow Wedding Surplus (AVAILABLE)
        LocalDateTime now = LocalDateTime.now();
        FoodDonation weddingDonation = new FoodDonation(
                rohit,
                "Rice, Dal Makhani, Shahi Paneer, Tandoori Roti",
                150.0,
                300,
                now.minusHours(1),
                now.plusHours(4),
                FoodType.VEG,
                "Awadh Convention Center, Gomti Nagar, Lucknow",
                26.8500,
                80.9990,
                "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
                "9876543210"
        );
        weddingDonation.setStatus(DonationStatus.AVAILABLE);
        donationRepository.save(weddingDonation);

        // 8. Seed Second Surplus: Hotel Buffet Chicken Dum Biryani & Kebabs (AVAILABLE)
        FoodDonation buffetDonation = new FoodDonation(
                hotelDonor,
                "Chicken Dum Biryani, Shami Kebabs, Gulab Jamun",
                45.0,
                90,
                now.minusMinutes(45),
                now.plusHours(3),
                FoodType.NON_VEG,
                "Grand Heritage Hotel, Vibhuti Khand, Lucknow",
                26.8620,
                81.0020,
                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
                "9811223344"
        );
        buffetDonation.setStatus(DonationStatus.AVAILABLE);
        donationRepository.save(buffetDonation);

        // 9. Seed Completed Past Donation (To demonstrate dashboard impact counters)
        FoodDonation completedDonation = new FoodDonation(
                rohit,
                "Assorted Sandwiches, Vegetable Pulao & Sweet Boondi",
                80.0,
                175,
                now.minusDays(2),
                now.minusDays(2).plusHours(5),
                FoodType.VEG,
                "Gomti Nagar Club, Lucknow",
                26.8510,
                80.9980,
                "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80",
                "9876543210"
        );
        completedDonation.setStatus(DonationStatus.COMPLETED);
        donationRepository.save(completedDonation);

        Pickup completedPickup = new Pickup(completedDonation, hopeNgo);
        completedPickup.setVolunteer(amitVolunteer);
        completedPickup.setPickupTime(now.minusDays(2).plusHours(1));
        completedPickup.setDeliveryTime(now.minusDays(2).plusHours(2));
        completedPickup.setPeopleServedActual(175);
        completedPickup.setStatus(PickupStatus.COMPLETED);
        pickupRepository.save(completedPickup);

        System.out.println("Food Rescue sample data initialized successfully!");
        System.out.println("Sample Accounts:");
        System.out.println(" - Admin: admin@foodrescue.org / admin123");
        System.out.println(" - Donor (Rohit): rohit.wedding@lucknow.com / password123");
        System.out.println(" - Verified NGO: ngo.hope@foodrescue.org / password123");
        System.out.println(" - Unverified NGO: ngo.care@foodrescue.org / password123");
        System.out.println(" - Volunteer: amit.volunteer@foodrescue.org / password123");
    }
}
