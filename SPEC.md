# Maritana - Aromas de Pareja (Next.js)

## Project Overview
- **Type**: Next.js web application
- **Core functionality**: Quiz app for couples to discover their compatible candle aroma blend
- **Target users**: Couples looking for personalized candle recommendations

## UI/UX Specification

### Layout Structure
- Single page app with state-based rendering (intro → quiz → message → result)
- Centered card layout with max-width 480px
- Full viewport height screens

### Visual Design
- **Colors**:
  - Background cream: #FDFBF7
  - Background peach: #FDF6EF
  - Primary green: #407645
  - Secondary brown: #B06A2A
  - Text dark: #3D3D3D
  - Text muted: #888
- **Typography**:
  - Logo: Prata (serif), 26px, letter-spacing 0.1em
  - Headings: Prata serif
  - Body: Montserrat
- **Components**:
  - Card with border-radius 16px, 0.5px border #e4e0d8
  - Progress bar with green fill
  - Turn banner (green for P1, peach for P2)
  - Option buttons with selection states
  - Chips for aromas and config
  - CTA buttons

### Animations
- Fade in animation (0.3s ease)
- Match percentage counter animation
- Button hover states

## Functionality Specification

### Core Features
1. **Intro Screen**: Welcome message and start button
2. **Quiz Flow**: 6 questions × 2 players = 12 steps
   - Shows progress bar
   - Alternates between Person 1 (green theme) and Person 2 (brown theme)
   - Each player selects from 4 options
3. **Message Screen**: Personalized message about their compatibility
4. **Result Screen**:
   - Compatibility percentage with animated counter
   - Recommended aromas (3)
   - Candle configuration (wax, wick, jar)
   - Price calculation
   - WhatsApp link generation
   - Email form with Resend integration

### Email Integration (Resend)
- API route at `/api/send-email`
- Accepts email address and result data
- Sends HTML email with:
  - Compatibility percentage
  - Recommended aromas
  - Candle configuration
  - WhatsApp link

## Acceptance Criteria
- [ ] App loads with intro screen
- [ ] Quiz progresses through all 12 steps
- [ ] Results calculate correctly based on answers
- [ ] Email sends successfully via Resend
- [ ] Visual design matches original HTML exactly
- [ ] Responsive on mobile devices
