# UI Guidelines

## Overview

This document defines the user interface guidelines for the TODO application. These guidelines ensure a consistent, accessible, and festive user experience throughout the application.

## Color Palette

### Christmas Theme

The application uses a festive Christmas-inspired color palette:

#### Primary Colors
- **Holly Green**: `#165B33` - Primary actions, headers
- **Festive Red**: `#C41E3A` - Accent color, important actions
- **Snow White**: `#FFFFFF` - Background, card surfaces
- **Midnight Blue**: `#0F4C81` - Text, borders

#### Secondary Colors
- **Gold**: `#D4AF37` - Highlights, success states
- **Silver**: `#C0C0C0` - Disabled states, dividers
- **Pine Green**: `#234F32` - Hover states, secondary actions
- **Cranberry**: `#9B1B30` - Error states, delete actions

#### Neutral Colors
- **Charcoal**: `#2C2C2C` - Primary text
- **Warm Gray**: `#6B6B6B` - Secondary text
- **Light Gray**: `#F5F5F5` - Background variations
- **Border Gray**: `#E0E0E0` - Borders, dividers

### Color Usage Guidelines
- Use Holly Green for primary buttons and main navigation
- Use Festive Red sparingly for important calls-to-action
- Maintain high contrast ratios for text readability (minimum 4.5:1)
- Use Gold for completion indicators and success messages
- Use Cranberry for delete actions and error states

## Typography

### Font Family
- **Primary Font**: Roboto (Material Design standard)
- **Fallback**: system-ui, -apple-system, sans-serif

### Font Scales
- **Display**: 2.5rem (40px) - Page titles
- **H1**: 2rem (32px) - Section headers
- **H2**: 1.5rem (24px) - Card titles
- **H3**: 1.25rem (20px) - Subsections
- **Body**: 1rem (16px) - Regular text
- **Small**: 0.875rem (14px) - Secondary information
- **Caption**: 0.75rem (12px) - Metadata, timestamps

### Font Weights
- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasis, labels
- **Bold**: 700 - Headers, important actions

### Line Height
- Headers: 1.2
- Body text: 1.5
- Small text: 1.4

## Material Components

### Required Components

#### Buttons
- **Material Button (Contained)**: Primary actions (Add TODO, Save)
  - Use Holly Green for primary buttons
  - Use Festive Red for delete actions
- **Material Button (Outlined)**: Secondary actions (Cancel, Clear)
- **Material Button (Text)**: Tertiary actions (Edit, Filter)
- **Material IconButton**: Icon-only actions (Delete, Complete)

#### Form Controls
- **Material TextField**: TODO input, edit fields
  - Use outlined variant for consistency
  - Include proper labels and helper text
- **Material Checkbox**: TODO completion toggle
  - Use Gold color when checked
- **Material Select/Menu**: Filter options

#### Feedback Components
- **Material Snackbar**: Success/error notifications
- **Material Dialog**: Confirmation dialogs (bulk delete)
- **Material CircularProgress**: Loading states
- **Material Tooltip**: Additional information on hover

#### Layout Components
- **Material Card**: TODO item containers
- **Material List/ListItem**: TODO list display
- **Material AppBar**: Application header
- **Material Divider**: Visual separators

### Component Customization
- Apply Christmas theme colors to Material components
- Maintain Material Design elevation and shadow standards
- Use 8dp grid system for spacing
- Implement proper ripple effects for interactive elements

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

#### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus indicators on all focusable elements
- Logical tab order through the interface
- Support for Enter/Space to activate buttons and checkboxes
- Escape key to close dialogs and cancel editing

#### Screen Reader Support
- Proper ARIA labels on all interactive elements
- ARIA live regions for dynamic content updates (TODO added/deleted)
- Semantic HTML structure (main, nav, header, section, article)
- Alt text for decorative elements using empty alt=""
- Descriptive button labels (not just icons)

#### Visual Accessibility
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text (18pt+)
- Minimum 3:1 contrast ratio for UI components and borders
- No information conveyed by color alone
- Text resizable up to 200% without loss of functionality

#### Focus Management
- Focus trapped in modal dialogs
- Focus returned to trigger element when closing dialogs
- Skip navigation links for keyboard users
- Clear focus indicators (2px solid outline)

#### Error Handling
- Clear error messages associated with form fields
- Error states announced to screen readers
- Multiple sensory characteristics (color + icon + text)

### Additional Accessibility Features
- Reduced motion support (prefers-reduced-motion media query)
- High contrast mode compatibility
- Touch targets minimum 44x44px (following WCAG 2.5.5)
- Support for voice control software
- Proper heading hierarchy (h1 → h2 → h3)

## Layout & Spacing

### Grid System
- Use 8px base unit (8dp grid)
- Common spacing values: 8px, 16px, 24px, 32px, 40px
- Container max-width: 1200px
- Content padding: 16px mobile, 24px tablet, 32px desktop

### Component Spacing
- Space between list items: 8px
- Space between sections: 32px
- Card padding: 16px
- Button padding: 8px 16px
- Form field margins: 16px

### Responsive Breakpoints
- Mobile: 0-599px
- Tablet: 600-1023px
- Desktop: 1024px+
- Large Desktop: 1440px+

## Interactive States

### Button States
- **Default**: Base colors as defined
- **Hover**: Darken by 10%, elevation increase
- **Active**: Darken by 20%, elevation decrease
- **Disabled**: 38% opacity, no pointer events
- **Focus**: 2px outline, Holly Green color

### TODO Item States
- **Default**: White background, border
- **Hover**: Light Gray background
- **Completed**: Strikethrough text, reduced opacity (60%)
- **Editing**: Gold border, white background
- **Selected**: Pine Green border

### Loading States
- Use Material CircularProgress in Holly Green
- Display loading indicators for operations >300ms
- Disable interactive elements during async operations

## Animations & Transitions

### Timing
- Fast transitions: 150ms (hover, ripple)
- Medium transitions: 250ms (expand/collapse, fade)
- Slow transitions: 400ms (page transitions, dialogs)
- Easing: Material Design standard (cubic-bezier)

### Animation Guidelines
- Use fade-in for new TODO items (250ms)
- Use slide-out for deleted items (200ms)
- Respect prefers-reduced-motion setting
- Avoid animations >400ms
- No auto-playing animations

## Icons

### Icon Library
- Material Icons (Material Design Icons)
- Icon size: 24px standard, 20px for small contexts
- Icon color: Inherit from parent or Charcoal

### Common Icons
- Add TODO: `add_circle_outline` or `add`
- Delete TODO: `delete_outline` or `close`
- Complete TODO: `check_circle` or `check_box`
- Edit TODO: `edit` or `edit_outline`
- Filter: `filter_list`
- Clear completed: `delete_sweep`

## Responsive Design

### Mobile (0-599px)
- Single column layout
- Full-width cards
- Stacked navigation
- Larger touch targets (48x48px minimum)
- Bottom sheet for filters/actions

### Tablet (600-1023px)
- Consider two-column layout for wide screens
- Side drawer for filters
- Maintain touch-friendly sizing

### Desktop (1024px+)
- Maximum content width constraint (1200px)
- Utilize horizontal space effectively
- Mouse-optimized interactions (smaller targets acceptable)
- Hover states for better feedback

## Error & Empty States

### Empty State
- Centered icon (gift or ornament themed)
- Message: "No TODOs yet! Add your first task to get started."
- Clear call-to-action button
- Use warm, encouraging language

### Error States
- Display Cranberry-colored error icon
- Clear, actionable error messages
- Retry options when appropriate
- No technical jargon in user-facing messages

### Success States
- Green checkmark or Gold star icon
- Brief success message in Snackbar
- Auto-dismiss after 4 seconds

## Festive Touches

### Optional Decorative Elements
- Subtle snowflake background pattern (very light, non-intrusive)
- Christmas ornament icons for completed TODOs
- Holly leaf accents in headers
- Gentle shimmer effect on Gold elements
- Festive icons in empty states

### Seasonal Considerations
- Keep decorative elements subtle and professional
- Ensure decorations don't interfere with functionality
- Maintain accessibility standards with all decorative elements
- Option to reduce decorative elements if desired

## Performance Guidelines

### Optimization
- Lazy load images and heavy components
- Minimize bundle size
- Use CSS-in-JS or CSS Modules efficiently
- Optimize re-renders with React best practices
- Target 60fps for all animations

### Loading Strategy
- Show skeleton screens for initial load
- Progressive enhancement approach
- Cache static assets
- Optimize for Core Web Vitals (LCP, FID, CLS)

## Browser Support

### Supported Browsers
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Progressive Enhancement
- Core functionality works without JavaScript
- Graceful degradation for older browsers
- Feature detection over browser detection
