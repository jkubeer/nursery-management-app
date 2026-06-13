# Daycare Management System - Project TODO

## Database & Schema
- [x] Design and implement database schema for all modules
- [x] Create tables: staff, children, parents, rooms, facilities, activities, payments, check_in_out, photos
- [x] Set up relationships and constraints
- [x] Run initial migrations

## Backend API Development
- [x] Staff management endpoints (CRUD, roles, schedules)
- [x] Children registry endpoints (profiles, medical info, enrollment)
- [x] Parent/guardian endpoints (profiles, multiple children linkage)
- [x] Rooms and facilities endpoints (capacity, age groups, resources)
- [x] Activities endpoints (scheduling, tracking, attendance)
- [x] Check-in/check-out system endpoints
- [x] Payment endpoints (fee management, invoicing)
- [ ] Photo storage and retrieval endpoints
- [x] Dashboard statistics endpoints
- [x] Email notification service integration
- [ ] Stripe payment integration endpoints

## Frontend - Dashboard & Layout
- [x] Design elegant dashboard layout with sidebar navigation
- [x] Implement role-based access control (admin, staff, parent)
- [x] Create dashboard overview with statistics
- [x] Build responsive design for all screen sizes
- [x] Set up elegant color scheme and typography

## Frontend - Staff Management Module
- [x] Staff list page with search and filters
- [x] Staff profile creation/edit form
- [x] Role assignment interface
- [ ] Schedule management page
- [x] Contact information management

## Frontend - Children Registry Module
- [x] Children list page with search and filters
- [x] Child profile creation/edit form
- [x] Medical information form
- [x] Emergency contacts form
- [x] Enrollment details form

## Frontend - Parent/Guardian Module
- [x] Parent list page
- [x] Parent profile creation/edit form
- [x] Multiple children linkage interface
- [ ] Communication tools (messaging, notifications)
- [ ] Parent dashboard for viewing child info

## Frontend - Rooms & Facilities Module
- [x] Rooms list page
- [x] Room creation/edit form
- [x] Capacity and age group management
- [ ] Resource allocation interface
- [x] Facilities tracking page

## Frontend - Activities Module
- [ ] Activities calendar view
- [x] Activity creation/edit form
- [ ] Attendance tracking interface
- [ ] Photo upload and gallery
- [ ] Daily reports generation

## Frontend - Check-in/Check-out System
- [x] Check-in/check-out interface
- [x] Real-time attendance tracking
- [ ] Attendance history and reports

## Frontend - Payment Management Module
- [x] Payment list and history page
- [x] Fee management interface
- [ ] Invoice generation and viewing
- [ ] Payment reminders setup
- [ ] Stripe payment form integration

## Frontend - Photo Management
- [x] Photo upload interface for activities
- [x] Photo gallery for parents
- [x] Parent access controls for photos
- [x] Photo organization and tagging
- [x] Photo Management Page (New)
- [x] Photo Upload with Drag & Drop
- [x] Photo Gallery with Filtering
- [x] Photo Sharing with Parents
- [x] Photo Metadata and Organization

## Frontend - Settings Page
- [x] Settings page with multiple tabs (General, Notifications, Security, Account)
- [x] General settings (nursery name, phone, address)
- [x] Notification preferences (daily reports, payment reminders, alerts)
- [x] Security settings (password reset, active sessions)
- [x] Account information display
- [x] Route /settings working correctly
- [x] Settings link in navigation menu

## Integration - Stripe Payment Processing
- [ ] Set up Stripe account and API keys
- [ ] Implement tuition payment processing
- [ ] Implement registration fee processing
- [ ] Implement recurring billing for parents
- [ ] Payment status tracking and reconciliation

## Integration - Email Notifications
- [ ] Set up email service (SendGrid or similar)
- [ ] Daily report email template
- [ ] Event notification email template
- [ ] Payment reminder email template
- [ ] Emergency alert email template
- [ ] Automated email sending triggers

## Advanced Reporting Features
- [x] Attendance Report Module (Daily, Weekly, Monthly)
- [x] Financial Report Module (Invoices, Payments, Outstanding)
- [x] Activity Report Module (Participation, Engagement)
- [ ] Staff Report Module (Hours, Assignments)
- [ ] Export Reports to PDF/Excel
- [ ] Report Scheduling and Automation
- [x] Report Analytics Dashboard

## Polish & Optimization
- [ ] UI/UX Improvements (Animations, Transitions)
- [ ] Component Refinement (Better Forms, Tables)
- [ ] Loading States and Skeletons
- [ ] Error Handling and User Feedback
- [ ] Accessibility Improvements (WCAG)
- [ ] Mobile Responsiveness Enhancements
- [ ] Dark Mode Support
- [ ] Code Splitting and Lazy Loading
- [ ] Database Query Optimization
- [ ] Caching Strategy Implementation
- [ ] Performance Monitoring

## Testing & Optimization
- [x] Write unit tests for backend procedures
- [ ] Write integration tests for API endpoints
- [ ] Test payment processing workflow
- [ ] Test email notification delivery
- [x] Write tests for photo management
- [x] Write tests for reporting features
- [ ] Performance optimization
- [ ] Security audit

## Deployment & Documentation
- [ ] Create user documentation
- [ ] Create admin setup guide
- [ ] Create API documentation
- [ ] Final testing and quality assurance
- [ ] Deploy to production


## Metronic Template Integration
- [x] Install Metronic Free template dependencies
- [x] Setup Metronic layout structure (Header, Sidebar, Footer)
- [x] Convert Dashboard to Metronic design
- [x] Convert Staff table to Metronic table component
- [x] Convert Children table to Metronic table component
- [x] Convert Parents table to Metronic table component
- [x] Convert Rooms table to Metronic table component
- [x] Convert all forms to Metronic form components
- [x] Convert Reports page to Metronic charts and analytics
- [x] Convert Photos page to Metronic gallery
- [x] Convert Settings page to Metronic tabs
- [x] Customize Metronic theme colors and branding
- [x] Test all functionality with Metronic UI
- [x] Fix any bugs or styling issues


## Bilingual Support (Arabic/English)
- [x] Install i18n library (react-i18next)
- [x] Create translation files (en.json, ar.json)
- [x] Implement language switcher component
- [x] Fix Arabic translation display when switching language
- [x] Add RTL support for Arabic
- [x] Translate DashboardNav component with i18n
- [x] Add RTL layout support in DashboardNav
- [ ] Translate all UI components (Staff, Children, Parents, Rooms, etc.)
- [ ] Translate dashboard and all pages
- [ ] Translate forms and modals
- [ ] Translate error messages and notifications

## User Management System
- [x] Create users table in database
- [x] Create user_privileges table
- [x] Create roles table with predefined roles
- [x] Add user CRUD procedures in backend
- [x] Build Users Management page (admin only)
- [x] Implement user creation/edit/delete forms
- [x] Create Privileges management page
- [x] Add privilege assignment interface in Privileges page
- [ ] Create role management page
- [ ] Implement permission checking in UI
- [ ] Add audit logging for user actions
- [ ] Create user activity report

## Dashboard Redesign
- [x] Redesign dashboard with nursery care theme
- [x] Add professional background and colors
- [x] Enhance stat cards with better styling
- [x] Add welcome section with nursery branding
- [x] Improve quick actions layout
- [x] Add visual indicators for system status

## Password-Based Authentication
- [x] Add passwordHash field to users table
- [x] Make openId optional for password users
- [x] Make email unique for password users
- [x] Install bcryptjs for password hashing
- [x] Create password authentication utility functions
- [x] Add password validation (8+ chars, uppercase, lowercase, number)
- [x] Add email validation
- [x] Implement register procedure (validation, hashing, user creation)
- [x] Implement login procedure (email lookup, password verification, session creation)
- [x] Fix logout functionality (clear session cookie)
- [x] Create Login page with email/password form
- [x] Create Register page with password requirements display
- [x] Add login/register routes to App.tsx
- [x] Update Home page with login/register buttons
- [x] Write comprehensive authentication tests
- [x] Add password field to Users management form
- [x] Update user creation to accept password
- [x] Fix authentication context to handle password-based users
- [x] Test registration workflow end-to-end
- [x] Test login workflow end-to-end
- [x] Test logout functionality
- [x] Test session persistence
- [x] Test mixed OAuth and password authentication


## Password Recovery (Forgot Password)
- [x] Add passwordResetToken and passwordResetExpiry fields to users table
- [x] Create backend procedure for requesting password reset
- [x] Create backend procedure for verifying reset token
- [x] Create backend procedure for resetting password with token
- [x] Add 'Forgot Password' link to Home page login form
- [x] Add 'Forgot Password' link to Login page
- [x] Create ForgotPassword page with email input
- [x] Create ResetPassword page with token validation and new password form
- [ ] Implement email sending for password reset links
- [x] Add password reset token validation and expiry checks
- [x] Write tests for password recovery procedures
- [ ] Test complete password recovery workflow end-to-end


## Form Labels & Accessibility
- [x] Add labels to Staff edit form fields
- [x] Add labels to Children edit form fields
- [x] Add labels to Parents edit form fields
- [x] Add labels to Rooms edit form fields
- [x] Add labels to Activities edit form fields
- [x] Add labels to Payments edit form fields
- [x] Add labels to Users edit form fields
- [x] Add labels to all other edit forms
- [ ] Test form accessibility with screen readers
- [x] Verify all form fields have associated labels


## Super Admin Multi-Tenancy Layer
- [x] Create nurseries table in database schema (name, contact_name, contact_email, contact_phone, logo, address, latitude, longitude, admin_id)
- [x] Add nursery_id (tenant) column to all existing tables for data isolation
- [x] Add super_admin role to users table
- [x] Build Super Admin dashboard with nursery list and stats
- [x] Build Create Nursery form (name, contact details, logo, address, Google Maps location, admin credentials)
- [x] Build Edit Nursery page
- [x] Build View Nursery page
- [x] Add tenant isolation to all existing queries (filter by nursery_id)
- [x] Super Admin can view/manage all nurseries
- [x] Each nursery admin only sees their own nursery data
- [x] Separate login routing (super_admin goes to super dashboard, nursery admin goes to nursery dashboard)
- [x] Assign existing data to Kuwait Sunshine Nursery
- [x] Add delete room functionality
- [x] Display admin details on View/Edit Nursery pages

## Referential Integrity & Data Validation
- [x] Prevent deletion of rooms that have children assigned
- [x] Prevent deletion of parents that have children assigned
- [x] Make parent mandatory for child registration
- [x] Add parent dropdown/picker to Children form
- [x] Add validation error messages for constraint violations
- [x] Fix dropdown placeholders (Gender, Parent, Room all start with Select)
- [x] Add parentId to children update mutation
- [x] Add delete functionality to children, parents, staff, activities
- [x] Add delete buttons to all entity pages with confirmation
- [x] Fix children update form validation
- [x] FIX: Children update now includes gender, dateOfBirth, enrollmentDate fields
- [x] FIX: Children edit form properly formats dates for input fields
- [x] FIX: Parents delete checks children.parentId instead of parentChildRelationships
- [x] FIX: Parents delete button now visible and functional
- [x] FIX: All update/delete mutations now have tenant scoping


## Role-Based Access Control (RBAC) & Privilege Enforcement
- [x] Hide Settings, Users, Privileges from non-admin users in sidebar
- [x] Create privilege checking utilities and hooks
- [x] Implement privilege checks on Staff page (view/manage/delete)
- [x] Implement privilege checks on Children page (view/manage/delete)
- [x] Implement privilege checks on Parents page (view/manage/delete)
- [x] Implement privilege checks on Rooms page (view/manage/delete)
- [x] Implement privilege checks on Activities page (view/manage/delete)
- [x] Disable/hide create buttons based on manage privilege
- [x] Disable/hide edit buttons based on manage privilege
- [x] Disable/hide delete buttons based on delete privilege
- [ ] Show "No Permission" message when user lacks privileges
- [ ] Fix Privileges system - staff with only view privilege can't edit/create/delete


## Parent Portal Implementation
- [x] Create ParentDashboard page with children list and payment summary
- [x] Create ParentLayout component (separate from DashboardLayout)
- [x] Create parent-only routes in App.tsx (/parent-dashboard, /parent-children, /parent-payments)
- [x] Add ParentProtectedRoute component for parent-only access control
- [x] Update Home.tsx login redirect to route parents to /parent-dashboard
- [x] Create parent-specific tRPC procedures for children/payments (with ownership checks)
- [x] Create ParentChildren page showing only their children
- [x] Create ParentPayments page showing only their payments
- [x] Implement parent data isolation - prevent parents from accessing other parents' data
- [x] Add payment form for parents to make payments
- [ ] Add daily reports view for parents (read-only)
- [ ] Add photos gallery for parents (only their children's photos)
- [x] Create ParentNav component with limited menu items
- [x] Test parent portal access controls
- [x] Verify parents cannot access admin/staff/nursery-wide data


## Parent Portal Backend Security (CRITICAL)
- [x] Create parent-specific tRPC procedures (parent.me, parent.children, parent.payments, parent.invoices) with ownership checks
- [x] Add ownership validation to all parent-accessible procedures to prevent accessing other parents' data
- [x] Block parents from accessing shared nursery routes (/staff, /children, /parents, /rooms, /activities, /reports)
- [x] Update DashboardNav to hide nursery-wide sections from parent users
- [ ] Implement real payment processing with Stripe integration
- [ ] Add invoice status update when payment is recorded
- [x] Add backend tests for parent access control violations
- [x] Verify parents cannot call admin-only procedures


## User Type Implementation (Staff vs Parent Login)
- [x] Add userType field to users table schema (values: 'staff' or 'parent')
- [x] Add userType column to database via SQL migration
- [x] Update createPasswordUser function to accept and set userType parameter
- [x] Update upsertUser function to set userType based on role during OAuth login
- [x] Update auth.register to accept userType parameter from frontend
- [x] Update Home.tsx login page to support registration with userType selection
- [x] Update Home.tsx to redirect users based on userType (staff → /dashboard, parent → /parent-dashboard)
- [x] Create userType authentication tests (12/12 tests passing)
- [x] Verify userType is independent from role field
- [x] Test staff user access to dashboard
- [x] Test parent user access to parent portal
- [x] Test OAuth login sets userType correctly


## Conditional Role Selection (userType-based)
- [x] Update schema to make role enum exclude 'parent' (only staff, admin, teacher)
- [x] Update user management dialog to show/hide role based on userType selection
- [x] Show role dropdown only when userType='staff'
- [x] Hide role field when userType='parent'
- [x] Update backend to validate role is required for staff, not required for parents
- [x] Update user creation procedure to handle nullable role for parents
- [x] Update database migration to change role enum values
- [x] Test user creation with parent (no role)
- [x] Test user creation with staff (with role)
- [x] Update all role comparisons to use userType for parent checks
- [x] Update parent router procedures to check userType instead of role
- [x] Update App.tsx ProtectedRoute to check userType for parent routing
- [x] Update DashboardNav to check userType for parent filtering
