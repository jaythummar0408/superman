"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { PlaceholderTool } from "./placeholder-tool";

// Skeleton shown while a tool's code chunk is being fetched.
function ToolSkeleton() {
  return (
    <div className="animate-in fade-in flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-border/40 bg-white shadow-sm duration-300 dark:bg-card">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <p className="mt-3 text-sm text-muted-foreground">Loading tool…</p>
    </div>
  );
}

// Each tool is lazy-loaded and client-only, so a tool page ships just its own
// chunk (and heavy deps like the cropper / AI model load on demand).
const loading = () => <ToolSkeleton />;

const PdfMerger = dynamic(() => import("./pdf/pdf-merger").then((m) => m.PdfMerger), {
  ssr: false,
  loading,
});

// Image tools
const ImageCompressor = dynamic(
  () => import("./image/image-compressor").then((m) => m.ImageCompressor),
  { ssr: false, loading }
);
const ImageResizer = dynamic(() => import("./image/image-resizer").then((m) => m.ImageResizer), {
  ssr: false,
  loading,
});
const ImageCropper = dynamic(() => import("./image/image-cropper").then((m) => m.ImageCropper), {
  ssr: false,
  loading,
});
const BackgroundRemover = dynamic(
  () => import("./image/background-remover").then((m) => m.BackgroundRemover),
  { ssr: false, loading }
);
const ImageToPng = dynamic(() => import("./image/converters").then((m) => m.ImageToPng), {
  ssr: false,
  loading,
});
const JpgToPng = dynamic(() => import("./image/converters").then((m) => m.JpgToPng), {
  ssr: false,
  loading,
});
const PngToJpg = dynamic(() => import("./image/converters").then((m) => m.PngToJpg), {
  ssr: false,
  loading,
});
const WebpConverter = dynamic(() => import("./image/converters").then((m) => m.WebpConverter), {
  ssr: false,
  loading,
});
const ImageWatermark = dynamic(
  () => import("./image/image-watermark").then((m) => m.ImageWatermark),
  { ssr: false, loading }
);
const ImageBlur = dynamic(() => import("./image/image-blur").then((m) => m.ImageBlur), {
  ssr: false,
  loading,
});
const ImageRotate = dynamic(() => import("./image/image-rotate").then((m) => m.ImageRotate), {
  ssr: false,
  loading,
});
const ImageFlip = dynamic(() => import("./image/image-flip").then((m) => m.ImageFlip), {
  ssr: false,
  loading,
});
const MemeGenerator = dynamic(() => import("./image/meme-generator").then((m) => m.MemeGenerator), {
  ssr: false,
  loading,
});
const QrGenerator = dynamic(() => import("./image/qr-generator").then((m) => m.QrGenerator), {
  ssr: false,
  loading,
});
const QrScanner = dynamic(() => import("./image/qr-scanner").then((m) => m.QrScanner), {
  ssr: false,
  loading,
});
const ColorPicker = dynamic(() => import("./image/color-picker").then((m) => m.ColorPicker), {
  ssr: false,
  loading,
});
const ColorPaletteGenerator = dynamic(
  () => import("./image/color-palette-generator").then((m) => m.ColorPaletteGenerator),
  { ssr: false, loading }
);
const FaviconGenerator = dynamic(
  () => import("./image/favicon-generator").then((m) => m.FaviconGenerator),
  { ssr: false, loading }
);

// Dev tools
const JsonFormatter = dynamic(() => import("./dev/json-tools").then((m) => m.JsonFormatter), {
  ssr: false,
  loading,
});
const JsonValidator = dynamic(() => import("./dev/json-tools").then((m) => m.JsonValidator), {
  ssr: false,
  loading,
});
const JsonMinifier = dynamic(() => import("./dev/json-tools").then((m) => m.JsonMinifier), {
  ssr: false,
  loading,
});
const JsonToCsv = dynamic(() => import("./dev/csv-json").then((m) => m.JsonToCsv), {
  ssr: false,
  loading,
});
const CsvToJson = dynamic(() => import("./dev/csv-json").then((m) => m.CsvToJson), {
  ssr: false,
  loading,
});
const XmlFormatter = dynamic(() => import("./dev/xml-tools").then((m) => m.XmlFormatter), {
  ssr: false,
  loading,
});
const XmlValidator = dynamic(() => import("./dev/xml-tools").then((m) => m.XmlValidator), {
  ssr: false,
  loading,
});
const YamlFormatter = dynamic(() => import("./dev/yaml-formatter").then((m) => m.YamlFormatter), {
  ssr: false,
  loading,
});
const Base64Encode = dynamic(() => import("./dev/base64").then((m) => m.Base64Encode), {
  ssr: false,
  loading,
});
const Base64Decode = dynamic(() => import("./dev/base64").then((m) => m.Base64Decode), {
  ssr: false,
  loading,
});
const JwtDecoder = dynamic(() => import("./dev/jwt-decoder").then((m) => m.JwtDecoder), {
  ssr: false,
  loading,
});
const JwtGenerator = dynamic(() => import("./dev/jwt-generator").then((m) => m.JwtGenerator), {
  ssr: false,
  loading,
});
const UrlEncoder = dynamic(() => import("./dev/url-tools").then((m) => m.UrlEncoder), {
  ssr: false,
  loading,
});
const UrlDecoder = dynamic(() => import("./dev/url-tools").then((m) => m.UrlDecoder), {
  ssr: false,
  loading,
});
const RegexTester = dynamic(() => import("./dev/regex-tester").then((m) => m.RegexTester), {
  ssr: false,
  loading,
});
const CronGenerator = dynamic(() => import("./dev/cron-generator").then((m) => m.CronGenerator), {
  ssr: false,
  loading,
});
const UuidGenerator = dynamic(() => import("./dev/uuid-generator").then((m) => m.UuidGenerator), {
  ssr: false,
  loading,
});
const UuidValidator = dynamic(() => import("./dev/uuid-validator").then((m) => m.UuidValidator), {
  ssr: false,
  loading,
});

// CSS tools — code formatters
const CssMinifier = dynamic(() => import("./css/css-minifier").then((m) => m.CssMinifier), {
  ssr: false,
  loading,
});
const CssBeautifier = dynamic(() => import("./css/css-beautifier").then((m) => m.CssBeautifier), {
  ssr: false,
  loading,
});
const HtmlMinifier = dynamic(() => import("./css/html-minifier").then((m) => m.HtmlMinifier), {
  ssr: false,
  loading,
});
const HtmlBeautifier = dynamic(() => import("./css/html-beautifier").then((m) => m.HtmlBeautifier), {
  ssr: false,
  loading,
});
const JsMinifier = dynamic(() => import("./css/js-minifier").then((m) => m.JsMinifier), {
  ssr: false,
  loading,
});
const JsBeautifier = dynamic(() => import("./css/js-beautifier").then((m) => m.JsBeautifier), {
  ssr: false,
  loading,
});
// CSS tools — visual generators
const GradientGenerator = dynamic(
  () => import("./css/gradient-generator").then((m) => m.GradientGenerator),
  { ssr: false, loading }
);
const BoxShadowGenerator = dynamic(
  () => import("./css/box-shadow-generator").then((m) => m.BoxShadowGenerator),
  { ssr: false, loading }
);
const TextShadowGenerator = dynamic(
  () => import("./css/text-shadow-generator").then((m) => m.TextShadowGenerator),
  { ssr: false, loading }
);
const BorderRadiusGenerator = dynamic(
  () => import("./css/border-radius-generator").then((m) => m.BorderRadiusGenerator),
  { ssr: false, loading }
);
const FlexboxGenerator = dynamic(
  () => import("./css/flexbox-generator").then((m) => m.FlexboxGenerator),
  { ssr: false, loading }
);
const GridGenerator = dynamic(() => import("./css/grid-generator").then((m) => m.GridGenerator), {
  ssr: false,
  loading,
});
const CssAnimationGenerator = dynamic(
  () => import("./css/animation-generator").then((m) => m.CssAnimationGenerator),
  { ssr: false, loading }
);
const ClampCalculator = dynamic(
  () => import("./css/clamp-calculator").then((m) => m.ClampCalculator),
  { ssr: false, loading }
);

// Security tools
const PasswordGenerator = dynamic(
  () => import("./security/password-generator").then((m) => m.PasswordGenerator),
  { ssr: false, loading }
);
const PasswordChecker = dynamic(
  () => import("./security/password-checker").then((m) => m.PasswordChecker),
  { ssr: false, loading }
);
const Sha256Generator = dynamic(
  () => import("./security/hash-tools").then((m) => m.Sha256Generator),
  { ssr: false, loading }
);
const Md5Generator = dynamic(() => import("./security/hash-tools").then((m) => m.Md5Generator), {
  ssr: false,
  loading,
});
const HashGenerator = dynamic(() => import("./security/hash-tools").then((m) => m.HashGenerator), {
  ssr: false,
  loading,
});
const HashChecker = dynamic(() => import("./security/hash-tools").then((m) => m.HashChecker), {
  ssr: false,
  loading,
});
const BcryptGenerator = dynamic(
  () => import("./security/bcrypt-generator").then((m) => m.BcryptGenerator),
  { ssr: false, loading }
);
const DnsLookup = dynamic(() => import("./security/dns-lookup").then((m) => m.DnsLookup), {
  ssr: false,
  loading,
});
const IpLookup = dynamic(() => import("./security/ip-lookup").then((m) => m.IpLookup), {
  ssr: false,
  loading,
});

// Social media tools
const YoutubeThumbnail = dynamic(
  () => import("./social/youtube-thumbnail").then((m) => m.YoutubeThumbnail),
  { ssr: false, loading }
);
const YoutubeTitleGenerator = dynamic(
  () => import("./social/youtube-title-generator").then((m) => m.YoutubeTitleGenerator),
  { ssr: false, loading }
);
const YoutubeDescriptionGenerator = dynamic(
  () => import("./social/youtube-description-generator").then((m) => m.YoutubeDescriptionGenerator),
  { ssr: false, loading }
);
const InstagramCaptionGenerator = dynamic(
  () => import("./social/instagram-caption-generator").then((m) => m.InstagramCaptionGenerator),
  { ssr: false, loading }
);
const InstagramHashtagGenerator = dynamic(
  () => import("./social/instagram-hashtag-generator").then((m) => m.InstagramHashtagGenerator),
  { ssr: false, loading }
);
const FacebookTextFormatter = dynamic(
  () => import("./social/facebook-text-formatter").then((m) => m.FacebookTextFormatter),
  { ssr: false, loading }
);
const TwitterCharacterCounter = dynamic(
  () => import("./social/twitter-character-counter").then((m) => m.TwitterCharacterCounter),
  { ssr: false, loading }
);
const TiktokCaptionGenerator = dynamic(
  () => import("./social/tiktok-caption-generator").then((m) => m.TiktokCaptionGenerator),
  { ssr: false, loading }
);

// Text tools
const WordCounter = dynamic(() => import("./text/counters").then((m) => m.WordCounter), {
  ssr: false,
  loading,
});
const CharacterCounter = dynamic(() => import("./text/counters").then((m) => m.CharacterCounter), {
  ssr: false,
  loading,
});
const CaseConverter = dynamic(() => import("./text/case-converter").then((m) => m.CaseConverter), {
  ssr: false,
  loading,
});
const TextDiff = dynamic(() => import("./text/text-diff").then((m) => m.TextDiff), {
  ssr: false,
  loading,
});
const TextRepeater = dynamic(() => import("./text/line-tools").then((m) => m.TextRepeater), {
  ssr: false,
  loading,
});
const RemoveDuplicates = dynamic(() => import("./text/line-tools").then((m) => m.RemoveDuplicates), {
  ssr: false,
  loading,
});
const SortLines = dynamic(() => import("./text/line-tools").then((m) => m.SortLines), {
  ssr: false,
  loading,
});
const ReverseText = dynamic(() => import("./text/line-tools").then((m) => m.ReverseText), {
  ssr: false,
  loading,
});
const RandomText = dynamic(() => import("./text/random-text").then((m) => m.RandomText), {
  ssr: false,
  loading,
});
const LoremIpsum = dynamic(() => import("./text/lorem-ipsum").then((m) => m.LoremIpsum), {
  ssr: false,
  loading,
});
const FancyText = dynamic(() => import("./text/fancy-text").then((m) => m.FancyText), {
  ssr: false,
  loading,
});
const SlugGenerator = dynamic(() => import("./text/slug-generator").then((m) => m.SlugGenerator), {
  ssr: false,
  loading,
});
const KeywordDensity = dynamic(() => import("./text/keyword-density").then((m) => m.KeywordDensity), {
  ssr: false,
  loading,
});
const MarkdownEditor = dynamic(() => import("./text/markdown-editor").then((m) => m.MarkdownEditor), {
  ssr: false,
  loading,
});

// Utility tools
const AgeCalculator = dynamic(() => import("./utility/date-tools").then((m) => m.AgeCalculator), {
  ssr: false,
  loading,
});
const DateDifference = dynamic(() => import("./utility/date-tools").then((m) => m.DateDifference), {
  ssr: false,
  loading,
});
const EmiCalculator = dynamic(() => import("./utility/loan-tools").then((m) => m.EmiCalculator), {
  ssr: false,
  loading,
});
const LoanCalculator = dynamic(() => import("./utility/loan-tools").then((m) => m.LoanCalculator), {
  ssr: false,
  loading,
});
const SipCalculator = dynamic(() => import("./utility/sip-calculator").then((m) => m.SipCalculator), {
  ssr: false,
  loading,
});
const GstCalculator = dynamic(() => import("./utility/gst-calculator").then((m) => m.GstCalculator), {
  ssr: false,
  loading,
});
const PercentageCalculator = dynamic(
  () => import("./utility/percentage-calculator").then((m) => m.PercentageCalculator),
  { ssr: false, loading }
);
const BmiCalculator = dynamic(() => import("./utility/bmi-calculator").then((m) => m.BmiCalculator), {
  ssr: false,
  loading,
});
const UnitConverter = dynamic(() => import("./utility/unit-converter").then((m) => m.UnitConverter), {
  ssr: false,
  loading,
});
const CurrencyConverter = dynamic(
  () => import("./utility/currency-converter").then((m) => m.CurrencyConverter),
  { ssr: false, loading }
);
const TimezoneConverter = dynamic(
  () => import("./utility/timezone-converter").then((m) => m.TimezoneConverter),
  { ssr: false, loading }
);
const ScientificCalculator = dynamic(
  () => import("./utility/scientific-calculator").then((m) => m.ScientificCalculator),
  { ssr: false, loading }
);
const RandomNumber = dynamic(() => import("./utility/random-number").then((m) => m.RandomNumber), {
  ssr: false,
  loading,
});

interface ToolRegistryProps {
  slug: string;
  toolTitle: string;
}

/**
 * Maps a URL slug to its tool component. Tools that haven't been built yet
 * gracefully fall back to the "under construction" placeholder.
 */
const toolComponents: Record<string, React.ComponentType> = {
  "pdf-merger": PdfMerger,
  // Image tools
  "image-compressor": ImageCompressor,
  "image-resizer": ImageResizer,
  "image-cropper": ImageCropper,
  "background-remover": BackgroundRemover,
  "image-to-png": ImageToPng,
  "jpg-to-png": JpgToPng,
  "png-to-jpg": PngToJpg,
  "webp-converter": WebpConverter,
  "image-watermark": ImageWatermark,
  "image-blur": ImageBlur,
  "image-rotate": ImageRotate,
  "image-flip": ImageFlip,
  "meme-generator": MemeGenerator,
  "qr-generator": QrGenerator,
  "qr-scanner": QrScanner,
  "color-picker": ColorPicker,
  "color-palette-generator": ColorPaletteGenerator,
  "favicon-generator": FaviconGenerator,
  // Dev tools
  "json-formatter": JsonFormatter,
  "json-validator": JsonValidator,
  "json-minifier": JsonMinifier,
  "json-to-csv": JsonToCsv,
  "csv-to-json": CsvToJson,
  "xml-formatter": XmlFormatter,
  "xml-validator": XmlValidator,
  "yaml-formatter": YamlFormatter,
  "base64-encode": Base64Encode,
  "base64-decode": Base64Decode,
  "jwt-decoder": JwtDecoder,
  "jwt-generator": JwtGenerator,
  "url-encoder": UrlEncoder,
  "url-decoder": UrlDecoder,
  "regex-tester": RegexTester,
  "cron-generator": CronGenerator,
  "uuid-generator": UuidGenerator,
  "uuid-validator": UuidValidator,
  // CSS tools
  "css-minifier": CssMinifier,
  "css-beautifier": CssBeautifier,
  "html-minifier": HtmlMinifier,
  "html-beautifier": HtmlBeautifier,
  "js-minifier": JsMinifier,
  "js-beautifier": JsBeautifier,
  "gradient-generator": GradientGenerator,
  "box-shadow-generator": BoxShadowGenerator,
  "text-shadow-generator": TextShadowGenerator,
  "border-radius-generator": BorderRadiusGenerator,
  "flexbox-generator": FlexboxGenerator,
  "grid-generator": GridGenerator,
  "css-animation-generator": CssAnimationGenerator,
  "clamp-calculator": ClampCalculator,
  // Security tools
  "password-generator": PasswordGenerator,
  "password-checker": PasswordChecker,
  "sha256-generator": Sha256Generator,
  "md5-generator": Md5Generator,
  "hash-generator": HashGenerator,
  "hash-checker": HashChecker,
  "bcrypt-generator": BcryptGenerator,
  "dns-lookup": DnsLookup,
  "ip-lookup": IpLookup,
  // Social media tools
  "youtube-thumbnail-downloader": YoutubeThumbnail,
  "youtube-title-generator": YoutubeTitleGenerator,
  "youtube-description-generator": YoutubeDescriptionGenerator,
  "instagram-caption-generator": InstagramCaptionGenerator,
  "instagram-hashtag-generator": InstagramHashtagGenerator,
  "facebook-text-formatter": FacebookTextFormatter,
  "twitter-character-counter": TwitterCharacterCounter,
  "tiktok-caption-generator": TiktokCaptionGenerator,
  // Text tools
  "word-counter": WordCounter,
  "character-counter": CharacterCounter,
  "case-converter": CaseConverter,
  "text-diff": TextDiff,
  "text-repeater": TextRepeater,
  "remove-duplicates": RemoveDuplicates,
  "sort-lines": SortLines,
  "reverse-text": ReverseText,
  "random-text": RandomText,
  "lorem-ipsum": LoremIpsum,
  "fancy-text": FancyText,
  "slug-generator": SlugGenerator,
  "keyword-density": KeywordDensity,
  "markdown-editor": MarkdownEditor,
  // Utility tools
  "age-calculator": AgeCalculator,
  "emi-calculator": EmiCalculator,
  "gst-calculator": GstCalculator,
  "loan-calculator": LoanCalculator,
  "sip-calculator": SipCalculator,
  "currency-converter": CurrencyConverter,
  "unit-converter": UnitConverter,
  "percentage-calculator": PercentageCalculator,
  "scientific-calculator": ScientificCalculator,
  "timezone-converter": TimezoneConverter,
  "bmi-calculator": BmiCalculator,
  "date-difference": DateDifference,
  "random-number": RandomNumber,
};

export function ToolRegistry({ slug, toolTitle }: ToolRegistryProps) {
  const Component = toolComponents[slug];

  if (Component) {
    return <Component />;
  }

  return <PlaceholderTool toolTitle={toolTitle} />;
}
