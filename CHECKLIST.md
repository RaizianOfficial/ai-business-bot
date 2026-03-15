# AI Gift Hamper Order Assistant - Implementation Checklist

## Project Setup
- [x] Initialize Next.js project
- [x] Install dependencies (`firebase`, `gemini`, `nodemailer`, `framer-motion`)
- [ ] Configure Tailwind CSS
- [ ] Set up Firebase Admin SDK
- [ ] Set up Gemini AI configuration
- [ ] Set up Nodemailer configuration

## Database Initialization
- [ ] Create `products` collection in Firestore
- [ ] Seed sample products

## API Routes
- [ ] `GET /api/orders` - Admin: Fetch all orders
- [ ] `POST /api/chat` - Customer: Gemini AI interaction
- [ ] `POST /api/save-order` - System: Save order to Firestore & Send Email
- [ ] `PATCH /api/update-order` - Admin: Update status or delete

## UI Components
- [ ] `ChatWindow` - Floating AI chat interface
- [ ] `MessageBubble` - Chat message UI
- [ ] `ProductCard` - Landing page product display

## Pages
- [ ] `page.tsx` - Landing page with product list
- [ ] `admin/page.tsx` - Admin dashboard with passkey protection

## Final Polish
- [ ] Add animations (framer-motion)
- [ ] Responsive design check
- [ ] Deployment instructions
