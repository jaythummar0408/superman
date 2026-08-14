import {
  Image, Scaling, Crop, Eraser, FileImage, ArrowRightLeft, Palette,
  QrCode, ScanLine, Smile, Droplets, RotateCw, FlipHorizontal2, Pipette, SwatchBook, Star,
  Braces, CircleCheck, Minimize2, FileSpreadsheet, FileBraces, FileCode, FileCheck,
  Code, Binary, KeyRound, Lock, Link, Search, Clock, FingerprintPattern, Globe,
  Paintbrush, AlignLeft, Hash, Type, Maximize2, LayoutGrid, Grid3x3, Clapperboard, SlidersHorizontal,
  Shield, ShieldCheck, ShieldAlert, Key, LockKeyhole, Server, Wifi,
  Share2, Video, Camera, MessageCircle,
  BookOpen, CaseSensitive, ChartBar, Repeat, ListFilter, ArrowUpDown, Undo2, Shuffle, FileText, Sparkles, Tag, Keyboard,
  FileUp, FileDown, Merge, Scissors, Archive, LockOpen, FileOutput, Stamp,
  Coins, Receipt, Landmark, TrendingUp, DollarSign, Ruler, Percent, Brain, Timer, Heart, CalendarDays, Dices,
  User, AtSign, Palette as PaletteIcon, SmilePlus, Users, Dice1, CircleDot, UserCheck,
  Cake, Gift, CalendarHeart, GraduationCap, PartyPopper, Rocket, HeartHandshake, Presentation, Hourglass,
} from "lucide-react";
import { Tool } from "@/components/ui/tool-card";

export interface ToolCategory {
  name: string;
  description: string;
  tools: Tool[];
}

export const toolCategories: ToolCategory[] = [
  // ────────────────────────────────────────────
  // 🖼️ IMAGE TOOLS
  // ────────────────────────────────────────────
  {
    name: "Image Tools",
    description: "Convert, compress, resize and optimize your images with these powerful tools.",
    tools: [
      { title: "Image Compressor", description: "Compress images without losing quality. Supports JPEG, PNG, WebP.", icon: Image, href: "/tools/image-compressor", available: true },
      { title: "Image Resizer", description: "Resize images to exact dimensions or scale by percentage.", icon: Scaling, href: "/tools/image-resizer", available: true },
      { title: "Image Cropper", description: "Crop images to custom dimensions with a visual editor.", icon: Crop, href: "/tools/image-cropper", available: true },
      { title: "Background Remover", description: "Remove backgrounds from images automatically using AI.", icon: Eraser, href: "/tools/background-remover", available: true },
      { title: "Image to PNG Converter", description: "Convert any image format to high-quality PNG files.", icon: FileImage, href: "/tools/image-to-png", available: true },
      { title: "JPG to PNG Converter", description: "Convert JPG/JPEG images to PNG format instantly.", icon: ArrowRightLeft, href: "/tools/jpg-to-png", available: true },
      { title: "PNG to JPG Converter", description: "Convert PNG images to compressed JPG format.", icon: ArrowRightLeft, href: "/tools/png-to-jpg", available: true },
      { title: "WebP Converter", description: "Convert images to and from WebP format for the web.", icon: FileImage, href: "/tools/webp-converter", available: true },
      { title: "Image Watermark Tool", description: "Add text or image watermarks to protect your photos.", icon: Stamp, href: "/tools/image-watermark", available: true },
      { title: "QR Code Generator", description: "Generate QR codes from text, URLs or any data instantly.", icon: QrCode, href: "/tools/qr-generator", available: true },
      { title: "QR Code Scanner", description: "Scan and decode QR codes from uploaded images.", icon: ScanLine, href: "/tools/qr-scanner", available: true },
      { title: "Meme Generator", description: "Create custom memes with text overlays on images.", icon: Smile, href: "/tools/meme-generator", available: true },
      { title: "Image Blur Tool", description: "Apply blur effects to images or specific regions.", icon: Droplets, href: "/tools/image-blur", available: true },
      { title: "Image Rotate Tool", description: "Rotate images by any angle with precision controls.", icon: RotateCw, href: "/tools/image-rotate", available: true },
      { title: "Image Flip Tool", description: "Flip images horizontally or vertically in one click.", icon: FlipHorizontal2, href: "/tools/image-flip", available: true },
      { title: "Color Picker", description: "Pick colors from images and get HEX, RGB, HSL values.", icon: Pipette, href: "/tools/color-picker", available: true },
      { title: "Color Palette Generator", description: "Generate beautiful color palettes from images or randomly.", icon: SwatchBook, href: "/tools/color-palette-generator", available: true },
      { title: "Favicon Generator", description: "Generate favicons in all sizes from a single image.", icon: Star, href: "/tools/favicon-generator", available: true },
    ],
  },

  // ────────────────────────────────────────────
  // 💻 DEV TOOLS
  // ────────────────────────────────────────────
  {
    name: "Dev Tools",
    description: "Essential utilities for developers — formatters, validators, generators and more.",
    tools: [
      { title: "JSON Formatter", description: "Format, validate and beautify JSON data with syntax highlighting.", icon: Braces, href: "/tools/json-formatter", available: true },
      { title: "JSON Validator", description: "Validate JSON syntax and find errors with detailed messages.", icon: CircleCheck, href: "/tools/json-validator", available: true },
      { title: "JSON Minifier", description: "Minify JSON by removing whitespace to reduce file size.", icon: Minimize2, href: "/tools/json-minifier", available: true },
      { title: "JSON to CSV", description: "Convert JSON arrays to CSV format for spreadsheets.", icon: FileSpreadsheet, href: "/tools/json-to-csv", available: true },
      { title: "CSV to JSON", description: "Convert CSV data to structured JSON format.", icon: FileBraces, href: "/tools/csv-to-json", available: true },
      { title: "XML Formatter", description: "Format and beautify XML with proper indentation.", icon: FileCode, href: "/tools/xml-formatter", available: true },
      { title: "XML Validator", description: "Validate XML syntax and check for well-formedness.", icon: FileCheck, href: "/tools/xml-validator", available: true },
      { title: "YAML Formatter", description: "Format and validate YAML configuration files.", icon: AlignLeft, href: "/tools/yaml-formatter", available: true },
      { title: "Base64 Encode", description: "Encode text or files to Base64 string format.", icon: KeyRound, href: "/tools/base64-encode", available: true },
      { title: "Base64 Decode", description: "Decode Base64 strings back to original text or files.", icon: Binary, href: "/tools/base64-decode", available: true },
      { title: "JWT Decoder", description: "Decode and inspect JSON Web Token payloads and headers.", icon: Lock, href: "/tools/jwt-decoder", available: true },
      { title: "JWT Generator", description: "Generate signed JSON Web Tokens with custom payloads.", icon: Key, href: "/tools/jwt-generator", available: true },
      { title: "URL Encoder", description: "Encode special characters in URLs for safe transmission.", icon: Link, href: "/tools/url-encoder", available: true },
      { title: "URL Decoder", description: "Decode percent-encoded URLs back to readable text.", icon: Link, href: "/tools/url-decoder", available: true },
      { title: "Regex Tester", description: "Test and debug regular expressions with real-time matching.", icon: Search, href: "/tools/regex-tester", available: true },
      { title: "Cron Expression Generator", description: "Build and explain cron schedules with a visual editor.", icon: Clock, href: "/tools/cron-generator", available: true },
      { title: "UUID Generator", description: "Generate random UUIDs (v4) or sequential UUIDs for your projects.", icon: FingerprintPattern, href: "/tools/uuid-generator", available: true },
      { title: "UUID Validator", description: "Validate UUID format and identify the UUID version.", icon: CircleCheck, href: "/tools/uuid-validator", available: true },
      { title: "API Request Tester", description: "Send HTTP requests and inspect API responses in the browser.", icon: Globe, href: "/tools/api-tester" },
    ],
  },

  // ────────────────────────────────────────────
  // 🎨 CSS TOOLS
  // ────────────────────────────────────────────
  {
    name: "CSS Tools",
    description: "Generate, preview and copy CSS snippets for gradients, shadows, animations and more.",
    tools: [
      { title: "CSS Minifier", description: "Minify CSS code to reduce file size and improve performance.", icon: Minimize2, href: "/tools/css-minifier", available: true },
      { title: "CSS Beautifier", description: "Beautify and format CSS code with proper indentation.", icon: Paintbrush, href: "/tools/css-beautifier", available: true },
      { title: "HTML Minifier", description: "Minify HTML code by removing whitespace and comments.", icon: Minimize2, href: "/tools/html-minifier", available: true },
      { title: "HTML Beautifier", description: "Beautify and format HTML code for better readability.", icon: Code, href: "/tools/html-beautifier", available: true },
      { title: "JS Minifier", description: "Minify JavaScript code to reduce bundle size.", icon: Minimize2, href: "/tools/js-minifier", available: true },
      { title: "JS Beautifier", description: "Beautify and format JavaScript code with proper styling.", icon: Code, href: "/tools/js-beautifier", available: true },
      { title: "Gradient Generator", description: "Create beautiful CSS gradients with a visual editor.", icon: Palette, href: "/tools/gradient-generator", available: true },
      { title: "Box Shadow Generator", description: "Design and preview CSS box shadows with a visual builder.", icon: Maximize2, href: "/tools/box-shadow-generator", available: true },
      { title: "Text Shadow Generator", description: "Create CSS text shadow effects with live preview.", icon: Type, href: "/tools/text-shadow-generator", available: true },
      { title: "Border Radius Generator", description: "Generate CSS border-radius with a visual preview tool.", icon: Maximize2, href: "/tools/border-radius-generator", available: true },
      { title: "Flexbox Generator", description: "Visualize and generate CSS Flexbox layouts easily.", icon: LayoutGrid, href: "/tools/flexbox-generator", available: true },
      { title: "Grid Generator", description: "Build CSS Grid layouts with a visual drag-and-drop editor.", icon: Grid3x3, href: "/tools/grid-generator", available: true },
      { title: "CSS Animation Generator", description: "Create CSS keyframe animations with a timeline editor.", icon: Clapperboard, href: "/tools/css-animation-generator", available: true },
      { title: "Clamp Calculator", description: "Generate fluid CSS clamp() values for responsive typography.", icon: SlidersHorizontal, href: "/tools/clamp-calculator", available: true },
    ],
  },

  // ────────────────────────────────────────────
  // 🔒 SECURITY TOOLS
  // ────────────────────────────────────────────
  {
    name: "Security Tools",
    description: "Secure your data with password generators, hash tools, and network lookups.",
    tools: [
      { title: "Password Generator", description: "Generate strong, secure passwords with custom rules.", icon: LockKeyhole, href: "/tools/password-generator", available: true },
      { title: "Password Strength Checker", description: "Check how strong your password is and get improvement tips.", icon: ShieldCheck, href: "/tools/password-checker", available: true },
      { title: "SHA256 Generator", description: "Generate SHA-256 hash from any text input.", icon: Shield, href: "/tools/sha256-generator", available: true },
      { title: "MD5 Generator", description: "Generate MD5 hash from text for checksums and verification.", icon: Shield, href: "/tools/md5-generator", available: true },
      { title: "BCrypt Generator", description: "Generate BCrypt password hashes with configurable salt rounds.", icon: Lock, href: "/tools/bcrypt-generator", available: true },
      { title: "Hash Generator", description: "Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text.", icon: Lock, href: "/tools/hash-generator", available: true },
      { title: "Hash Checker", description: "Verify text against a hash to check for integrity.", icon: CircleCheck, href: "/tools/hash-checker", available: true },
      { title: "SSL Checker", description: "Check SSL certificate status and expiration for any domain.", icon: ShieldAlert, href: "/tools/ssl-checker" },
      { title: "Whois Lookup", description: "Look up domain registration details and ownership info.", icon: Globe, href: "/tools/whois-lookup" },
      { title: "IP Address Lookup", description: "Look up geolocation and details for any IP address.", icon: Wifi, href: "/tools/ip-lookup", available: true },
      { title: "DNS Lookup", description: "Query DNS records for any domain — A, MX, CNAME and more.", icon: Server, href: "/tools/dns-lookup", available: true },
    ],
  },

  // ────────────────────────────────────────────
  // 📱 SOCIAL MEDIA TOOLS
  // ────────────────────────────────────────────
  {
    name: "Social Media Tools",
    description: "Boost your social media presence with caption generators, tag extractors and more.",
    tools: [
      { title: "YouTube Thumbnail Downloader", description: "Download high-quality thumbnails from any YouTube video.", icon: Video, href: "/tools/youtube-thumbnail-downloader", available: true },
      { title: "YouTube Tags Extractor", description: "Extract tags and keywords from any YouTube video.", icon: Tag, href: "/tools/youtube-tags-extractor" },
      { title: "YouTube Title Generator", description: "Generate SEO-optimized titles for your YouTube videos.", icon: Video, href: "/tools/youtube-title-generator", available: true },
      { title: "YouTube Description Generator", description: "Create engaging YouTube video descriptions with keywords.", icon: FileText, href: "/tools/youtube-description-generator", available: true },
      { title: "Instagram Caption Generator", description: "Generate creative Instagram captions for your posts.", icon: Camera, href: "/tools/instagram-caption-generator", available: true },
      { title: "Instagram Hashtag Generator", description: "Find trending and relevant hashtags for Instagram posts.", icon: Hash, href: "/tools/instagram-hashtag-generator", available: true },
      { title: "Facebook Text Formatter", description: "Format text with bold, italic and special styles for Facebook.", icon: MessageCircle, href: "/tools/facebook-text-formatter", available: true },
      { title: "Twitter Character Counter", description: "Count characters and check tweet length limits in real time.", icon: MessageCircle, href: "/tools/twitter-character-counter", available: true },
      { title: "TikTok Caption Generator", description: "Generate catchy TikTok captions with trending hashtags.", icon: Video, href: "/tools/tiktok-caption-generator", available: true },
    ],
  },

  // ────────────────────────────────────────────
  // 📝 TEXT TOOLS
  // ────────────────────────────────────────────
  {
    name: "Text Tools",
    description: "Transform, analyze and manipulate text with these handy utilities.",
    tools: [
      { title: "Word Counter", description: "Count words, characters, sentences and paragraphs instantly.", icon: Hash, href: "/tools/word-counter", available: true },
      { title: "Character Counter", description: "Count characters with and without spaces in real time.", icon: Keyboard, href: "/tools/character-counter", available: true },
      { title: "Case Converter", description: "Convert text between uppercase, lowercase, title case and more.", icon: CaseSensitive, href: "/tools/case-converter", available: true },
      { title: "Text Diff Checker", description: "Compare two text blocks and highlight the differences.", icon: ChartBar, href: "/tools/text-diff", available: true },
      { title: "Text Repeater", description: "Repeat any text or string a specified number of times.", icon: Repeat, href: "/tools/text-repeater", available: true },
      { title: "Remove Duplicate Lines", description: "Remove duplicate lines from text and keep unique entries.", icon: ListFilter, href: "/tools/remove-duplicates", available: true },
      { title: "Sort Text Lines", description: "Sort lines alphabetically, numerically or in reverse order.", icon: ArrowUpDown, href: "/tools/sort-lines", available: true },
      { title: "Reverse Text", description: "Reverse text, words or lines in any direction.", icon: Undo2, href: "/tools/reverse-text", available: true },
      { title: "Random Text Generator", description: "Generate random text strings for testing and development.", icon: Shuffle, href: "/tools/random-text", available: true },
      { title: "Lorem Ipsum Generator", description: "Generate placeholder Lorem Ipsum text for designs and layouts.", icon: FileText, href: "/tools/lorem-ipsum", available: true },
      { title: "Fancy Text Generator", description: "Convert text to fancy Unicode fonts and symbols.", icon: Sparkles, href: "/tools/fancy-text", available: true },
      { title: "Slug Generator", description: "Generate URL-friendly slugs from any text string.", icon: Link, href: "/tools/slug-generator", available: true },
      { title: "Keyword Density Checker", description: "Analyze keyword frequency and density in your text.", icon: ChartBar, href: "/tools/keyword-density", available: true },
      { title: "Markdown Editor", description: "Write Markdown and preview the rendered HTML in real time.", icon: BookOpen, href: "/tools/markdown-editor", available: true },
    ],
  },

  // ────────────────────────────────────────────
  // 📄 PDF TOOLS
  // ────────────────────────────────────────────
  {
    name: "PDF Tools",
    description: "Merge, split, compress and convert PDF files with ease.",
    tools: [
      { title: "PDF to Word", description: "Convert PDF documents to editable Word (DOCX) files.", icon: FileUp, href: "/tools/pdf-to-word" },
      { title: "Word to PDF", description: "Convert Word documents to professional PDF files.", icon: FileDown, href: "/tools/word-to-pdf" },
      { title: "PDF Merger", description: "Merge multiple PDF files into a single document.", icon: Merge, href: "/tools/pdf-merger" },
      { title: "PDF Splitter", description: "Split a PDF into individual pages or custom ranges.", icon: Scissors, href: "/tools/pdf-splitter" },
      { title: "PDF Compressor", description: "Compress PDF files to reduce size without losing quality.", icon: Archive, href: "/tools/pdf-compressor" },
      { title: "PDF Protector", description: "Add password protection to your PDF documents.", icon: Lock, href: "/tools/pdf-protector" },
      { title: "Unlock PDF", description: "Remove password protection from PDF files.", icon: LockOpen, href: "/tools/unlock-pdf" },
      { title: "PDF Page Extractor", description: "Extract specific pages from a PDF document.", icon: FileOutput, href: "/tools/pdf-page-extractor" },
      { title: "PDF to Image", description: "Convert PDF pages to high-quality PNG or JPEG images.", icon: FileImage, href: "/tools/pdf-to-image" },
      { title: "Image to PDF", description: "Convert images to a single or multi-page PDF document.", icon: FileDown, href: "/tools/image-to-pdf" },
      { title: "PDF Watermark", description: "Add text or image watermarks to PDF documents.", icon: Stamp, href: "/tools/pdf-watermark" },
    ],
  },

  // ────────────────────────────────────────────
  // 🛠️ UTILITY TOOLS
  // ────────────────────────────────────────────
  {
    name: "Utility Tools",
    description: "Calculators, converters and everyday utilities for quick tasks.",
    tools: [
      { title: "Age Calculator", description: "Calculate exact age from date of birth in years, months, days.", icon: Cake, href: "/tools/age-calculator", available: true },
      { title: "EMI Calculator", description: "Calculate monthly EMI for loans with interest breakdown.", icon: Landmark, href: "/tools/emi-calculator", available: true },
      { title: "GST Calculator", description: "Calculate GST amounts with inclusive and exclusive options.", icon: Receipt, href: "/tools/gst-calculator", available: true },
      { title: "Loan Calculator", description: "Calculate loan payments, interest and amortization schedules.", icon: Coins, href: "/tools/loan-calculator", available: true },
      { title: "SIP Calculator", description: "Calculate returns on Systematic Investment Plan investments.", icon: TrendingUp, href: "/tools/sip-calculator", available: true },
      { title: "Currency Converter", description: "Convert between 150+ world currencies with live rates.", icon: DollarSign, href: "/tools/currency-converter", available: true },
      { title: "Unit Converter", description: "Convert between various units of length, weight, volume and more.", icon: Ruler, href: "/tools/unit-converter", available: true },
      { title: "Percentage Calculator", description: "Calculate percentages, increases, decreases and ratios.", icon: Percent, href: "/tools/percentage-calculator", available: true },
      { title: "Scientific Calculator", description: "Full-featured scientific calculator with advanced functions.", icon: Brain, href: "/tools/scientific-calculator", available: true },
      { title: "Timezone Converter", description: "Convert times between different timezones worldwide.", icon: Globe, href: "/tools/timezone-converter", available: true },
      { title: "BMI Calculator", description: "Calculate Body Mass Index and get health category results.", icon: Heart, href: "/tools/bmi-calculator", available: true },
      { title: "Date Difference Calculator", description: "Calculate the difference between two dates in various units.", icon: CalendarDays, href: "/tools/date-difference", available: true },
      { title: "Random Number Generator", description: "Generate random numbers within a custom range.", icon: Dices, href: "/tools/random-number", available: true },
    ],
  },

  // ────────────────────────────────────────────
  // 🎲 RANDOM GENERATORS
  // ────────────────────────────────────────────
  {
    name: "Random Generators",
    description: "Generate random data — names, colors, passwords, teams and more.",
    tools: [
      { title: "Random Name Generator", description: "Generate random realistic names for characters or testing.", icon: User, href: "/tools/random-name" },
      { title: "Random Username Generator", description: "Generate creative and unique usernames instantly.", icon: AtSign, href: "/tools/random-username" },
      { title: "Random Password Generator", description: "Generate cryptographically secure random passwords.", icon: LockKeyhole, href: "/tools/random-password" },
      { title: "Random Number Generator", description: "Generate random numbers with custom ranges and counts.", icon: Dices, href: "/tools/random-number-generator" },
      { title: "Random Color Generator", description: "Generate random colors in HEX, RGB and HSL formats.", icon: Palette, href: "/tools/random-color" },
      { title: "Random Emoji Generator", description: "Get random emojis for fun or creative inspiration.", icon: SmilePlus, href: "/tools/random-emoji" },
      { title: "Random Team Generator", description: "Split a list of people into random balanced teams.", icon: Users, href: "/tools/random-team" },
      { title: "Dice Roller", description: "Roll virtual dice with custom sides and multiple dice.", icon: Dice1, href: "/tools/dice-roller" },
      { title: "Coin Flip", description: "Flip a virtual coin for quick heads or tails decisions.", icon: CircleDot, href: "/tools/coin-flip" },
      { title: "Fake User Generator", description: "Generate realistic fake user profiles for testing purposes.", icon: UserCheck, href: "/tools/fake-user" },
    ],
  },

  // ────────────────────────────────────────────
  // ⏳ COUNTDOWN TOOLS
  // ────────────────────────────────────────────
  {
    name: "Countdown Tools",
    description: "Create beautiful countdown timers for events, launches and milestones.",
    tools: [
      { title: "Birthday Countdown", description: "Count down the days until your next birthday celebration.", icon: Cake, href: "/tools/birthday-countdown" },
      { title: "Wedding Countdown", description: "Track the countdown to your special wedding day.", icon: HeartHandshake, href: "/tools/wedding-countdown" },
      { title: "Event Countdown", description: "Create a countdown timer for any upcoming event.", icon: CalendarHeart, href: "/tools/event-countdown" },
      { title: "Exam Countdown", description: "Count down to your exam date to stay motivated.", icon: GraduationCap, href: "/tools/exam-countdown" },
      { title: "New Year Countdown", description: "Watch the countdown to midnight on New Year's Eve.", icon: PartyPopper, href: "/tools/new-year-countdown" },
      { title: "Product Launch Countdown", description: "Build hype with a countdown to your product launch.", icon: Rocket, href: "/tools/product-launch-countdown" },
      { title: "Live Countdown Timer", description: "Create a shareable live countdown timer for any date.", icon: Hourglass, href: "/tools/live-countdown" },
      { title: "Anniversary Countdown", description: "Count down to your wedding or relationship anniversary.", icon: Gift, href: "/tools/anniversary-countdown" },
      { title: "Webinar Countdown", description: "Set up a countdown timer for your upcoming webinar.", icon: Presentation, href: "/tools/webinar-countdown" },
    ],
  },
];
