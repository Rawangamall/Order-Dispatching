# Order-Dispatching System

The Order-Dispatching System is an integration system designed for e-commerce businesses to efficiently deliver orders. 
It includes a user dashboard with different roles (currently: Admin-dispatcher) and a website specifically for drivers.

## Features
1. **Automated Assignment:** When orders are received in Real Time, they are automatically assigned to the most suitable driver based on their location and workload. The system selects the driver with the least number of assigned orders, considering a maximum of 2 orders as the threshold for being busy.

2. **Reassignment Cases:**
   - Case 1: If all matched drivers are busy, the system reassigns the order to another available driver.
   - Case 2: If a driver cancels their assigned order before picking it up, the system reassigns the order to another driver.

3. **Automatic Reassignment:** Reassigned orders are automatically assigned to other matched drivers with a timer set at 2-minute intervals. This ensures prompt action and minimizes delays.

4. **Manual Assignment & Reassignment:**In case if the user want to handle the assign or reassign(before the 2 mins timer of automatic reassign) to specific driver we provide all the free matched drivers for each order needs to assign and reassign so he can select within the provided list.

5. **Driver Actions:** Drivers have four actions available to them:
   - Pick Order: Accept and assign an order to themselves for delivery.
   - Cancel Assigned Order: Request the system to reassign an order to another available driver.
   - Deliver: Indicate successful delivery of an order.
   - Cancel: Cancel an order that has been picked up.
     
6. **Notifaction System:** Its real time notifaction for both:
   - In dashboard for any logged in user when new order recieved.
   - In website for specific driver when there's new assigned order.
   
7. **Full CRUD Operations:**
    - Roles
    - Users management
    - Locations
    - Drivers

8. **Driver Reports:** The system generates a comprehensive report for each driver, including the number of orders they have handled and their average delivery time. These reports can be conveniently generated in PDF format.
   
9. **Status Logs:** To track each order with its different status within its changable time.
   
10. **Deactivation login with forget & reset password service during Gmail**

