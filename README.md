# Work Order Schedule Timeline - Angular Application

A fully functional Work Order Schedule Timeline component built with Angular 17+ using standalone components.

## Features

✅ **Timeline Grid** with Day/Week/Month zoom levels  
✅ **Work Order Bars** with status-based color coding  
✅ **Create/Edit Panel** with reactive form validation  
✅ **Overlap Detection** prevents scheduling conflicts  
✅ **Three-dot Menu** for Edit/Delete actions  
✅ **Current Day Indicator** shows today's date  
✅ **Horizontal Scrolling** with fixed work center column  
✅ **Sample Data** with 5 work centers and 8 work orders  

## Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 17+

## Usage Guide

### Viewing the Timeline
- Use the **Timescale dropdown** to switch between Day, Week, and Month views
- **Scroll horizontally** to see different date ranges
- **Red line** indicates today's date

### Creating Work Orders
1. Click on any empty space in the timeline
2. The panel opens with pre-filled start date (based on click position)
3. Fill in work order details
4. Click "Create" to save

### Editing Work Orders
1. Click the **three-dot menu** on any work order bar
2. Select "Edit"
3. Modify the details in the panel
4. Click "Save" to update

### Deleting Work Orders
1. Click the **three-dot menu** on any work order bar
2. Select "Delete"
3. Work order is removed immediately

### Overlap Detection
- The system prevents overlapping work orders on the same work center
- If you try to create/edit an order that overlaps, an error message appears
- Adjust the dates to resolve conflicts

## Key Implementation Details

### Date Positioning Algorithm
The component calculates bar positions based on:
- Start date relative to visible timeline range
- Current zoom level (day/week/month)
- Column width for each zoom level

### Form Validation
- All fields required
- End date must be after start date
- No overlaps on same work center
- Real-time error feedback

### Reactive Forms
Uses Angular Reactive Forms with FormBuilder:
- FormGroup for work order data
- Built-in and custom validators
- Two-way data binding with form controls

## Technologies Used

- **Angular 17** - Standalone components
- **TypeScript** - Strict mode
- **SCSS** - Component styling
- **Reactive Forms** - Form handling and validation
- **FormsModule** - Two-way binding for zoom selector

## Sample Data

The application includes:
- 5 Work Centers (Extrusion Line A, CNC Machine 1, Assembly Station, Quality Control, Packaging Line)
- 8 Work Orders with various statuses

## Architecture Highlights

### Service Layer
- **WorkOrderService**: Centralized data management using BehaviorSubject
- Observable pattern for reactive updates
- Business logic for overlap detection

### Component Layer
- **Standalone component** architecture (Angular 17+)
- **ViewChild** for DOM element references
- **TrackBy functions** for optimized rendering
- **OnDestroy** lifecycle hook for cleanup

### Form Management
- **Reactive Forms** with FormBuilder
- **FormGroup** with typed form controls
- **Validators** for required fields
- Real-time validation feedback

## Next Steps / Enhancements

Potential improvements for the future:

- [ ] **Drag-and-drop** - Resize/move orders visually
- [ ] **Infinite scroll** - Dynamically load more date ranges
- [ ] **Unit tests** - Component and service tests with Jasmine/Karma
- [ ] **E2E tests** - End-to-end scenarios with Cypress/Playwright
- [ ] **Accessibility** - ARIA labels, keyboard navigation

## Quick Start Commands

After downloading the code, run these commands:

# Install dependencies (if needed)
npm install

# Run development server
ng serve

# Build for production
ng build --configuration production
```
