"use client";

import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Paperclip,
  ChevronUp,
  X,
  Loader,
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useSimulateReview } from "@/hooks/use-simulate-review";
import { useRecommend } from "@/hooks/use-recommend";
import { ReviewDialog } from "@/components/review-dialog";
import type { SimulateReviewResponse } from "@/lib/types/review";
import type { RecommendationResponse } from "@/lib/types/recommendation";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

interface FormState {
  product_name: string;
  product_category: "food" | "book" | "movie" | "business";
  product_description: string;
  user_id: string;
  user_persona: string;
  business_name: string;
}

interface FormErrors {
  product_name?: string;
  product_category?: string;
  product_description?: string;
  user_context?: string;
  business_name?: string;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;

      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY),
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight],
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

const OPENAI_ICON = (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 256 260"
      aria-label="OpenAI Icon"
      className="w-4 h-4 dark:hidden block"
    >
      <title>OpenAI Icon Light</title>
      <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 256 260"
      aria-label="OpenAI Icon"
      className="w-4 h-4 hidden dark:block"
    >
      <title>OpenAI Icon Dark</title>
      <path
        fill="#fff"
        d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"
      />
    </svg>
  </>
);

export function AI_Prompt() {
  const [formState, setFormState] = useState<FormState>({
    product_name: "",
    product_category: "food",
    product_description: "",
    user_id: "",
    user_persona: "",
    business_name: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [userInputMode, setUserInputMode] = useState<"id" | "persona">(
    "persona",
  );
  const [charCount, setCharCount] = useState(0);
  const [language, setLanguage] = useState<
    "english" | "pidgin" | "yoruba" | "igbo" | "hausa" | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogResponse, setDialogResponse] = useState<{
    review: SimulateReviewResponse | null;
    recommendation: RecommendationResponse | null;
  }>({ review: null, recommendation: null });

  const contentRef = useRef<HTMLDivElement>(null);
  const { mutate: submitReview, isPending: isReviewPending } =
    useSimulateReview();
  const { mutate: submitRecommend, isPending: isRecommendPending } =
    useRecommend();

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 100,
    maxHeight: 300,
  });

  const [selectedModel, setSelectedModel] = useState("GPT-4-1 Mini");

  const PRODUCT_CATEGORIES = ["food", "book", "movie", "business"];
  const AI_MODELS = [
    "o3-mini",
    "Gemini 2.5 Flash",
    "Claude 3.5 Sonnet",
    "GPT-4-1 Mini",
    "GPT-4-1",
  ];

  // Check if required fields are filled based on mode
  const requiredFieldsFilled =
    formState.product_name.trim() &&
    formState.product_category &&
    formState.product_description.trim() &&
    (formState.user_id.trim() || formState.user_persona.trim());

  // Both requests are pending
  const isPending = isReviewPending || isRecommendPending;

  // Update content height on state changes
  useEffect(() => {
    if (contentRef.current) {
      const newHeight = contentRef.current.scrollHeight;
      // This effect just ensures the dialog stays sized properly
    }
  }, [formState, showAdvanced, userInputMode, errors]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation: At least one of user_id or user_persona must be provided
    if (!formState.user_id.trim() && !formState.user_persona.trim()) {
      newErrors.user_context = "Either user ID or persona must be provided";
    }

    // Review validations (always applies)
    if (!formState.product_name.trim()) {
      newErrors.product_name = "Product name is required";
    }
    if (!formState.product_category) {
      newErrors.product_category = "Category is required";
    }
    if (!formState.product_description.trim()) {
      newErrors.product_description = "Description is required";
    }

    // Validation: business_name is required for food/business categories
    if (
      (formState.product_category === "food" ||
        formState.product_category === "business") &&
      !formState.business_name.trim()
    ) {
      newErrors.business_name = "Business name is required for this category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Reset dialog responses for new submission
    setDialogResponse({ review: null, recommendation: null });
    setIsDialogOpen(true);

    const reviewPayload = {
      product_name: formState.product_name.trim(),
      product_category: formState.product_category,
      product_description: formState.product_description.trim(),
      ...(formState.user_id.trim() && { user_id: formState.user_id.trim() }),
      ...(formState.user_persona.trim() && {
        user_persona: formState.user_persona.trim(),
      }),
      ...(formState.business_name.trim() && {
        business_name: formState.business_name.trim(),
      }),
      language,
    };

    const recommendationPayload = {
      ...(formState.user_id.trim() && { user_id: formState.user_id.trim() }),
      ...(formState.user_persona.trim() && {
        user_persona: formState.user_persona.trim(),
      }),
      category: formState.product_category,
      language,
    };

    // Open dialog to show loading state
    setIsDialogOpen(true);

    // Make both API calls simultaneously
    submitReview(reviewPayload, {
      onSuccess: (reviewResponse) => {
        setDialogResponse((prev) => ({
          ...prev,
          review: reviewResponse,
        }));
      },
    });

    submitRecommend(recommendationPayload, {
      onSuccess: (recommendResponse) => {
        setDialogResponse((prev) => ({
          ...prev,
          recommendation: recommendResponse,
        }));
      },
    });
  };

  const resetForm = () => {
    setFormState({
      product_name: "",
      product_category: "food",
      product_description: "",
      user_id: "",
      user_persona: "",
      business_name: "",
    });
    setErrors({});
    setCharCount(0);
    setShowAdvanced(false);
  };

  const handleDescriptionChange = (value: string) => {
    setFormState((prev) => ({ ...prev, product_description: value }));
    setCharCount(value.length);
    adjustHeight();
  };

  const handleCategoryChange = (category: string) => {
    setFormState((prev) => ({
      ...prev,
      product_category: category as typeof formState.product_category,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && requiredFieldsFilled) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const MODEL_ICONS: Record<string, React.ReactNode> = {
    "o3-mini": OPENAI_ICON,
    "Gemini 2.5 Flash": (
      <svg
        height="1em"
        className="w-4 h-4"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Gemini</title>
        <defs>
          <linearGradient
            id="lobe-icons-gemini-fill"
            x1="0%"
            x2="68.73%"
            y1="100%"
            y2="30.395%"
          >
            <stop
              offset="0%"
              stopColor="#1C7DFF"
            />
            <stop
              offset="52.021%"
              stopColor="#1C69FF"
            />
            <stop
              offset="100%"
              stopColor="#F0DCD6"
            />
          </linearGradient>
        </defs>
        <path
          d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
          fill="url(#lobe-icons-gemini-fill)"
          fillRule="nonzero"
        />
      </svg>
    ),
    "Claude 3.5 Sonnet": (
      <>
        <svg
          fill="#000"
          fillRule="evenodd"
          className="w-4 h-4 dark:hidden block"
          viewBox="0 0 24 24"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Anthropic Icon Light</title>
          <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
        </svg>
        <svg
          fill="#fff"
          fillRule="evenodd"
          className="w-4 h-4 hidden dark:block"
          viewBox="0 0 24 24"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Anthropic Icon Dark</title>
          <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
        </svg>
      </>
    ),
    "GPT-4-1 Mini": OPENAI_ICON,
    "GPT-4-1": OPENAI_ICON,
  };

  return (
    <div className="w-4/6 py-4">
      {/* Main container with height constraints */}
      <motion.div
        className="bg-white dark:bg-white/5 rounded-2xl p-1.5 relative"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="relative flex flex-col h-full">
          {/* Scrollable Content Area */}
          <div
            ref={contentRef}
            className="flex-1 flex flex-col space-y-3 p-4 pb-0"
          >
            {/* Mode Toggle */}
            {/* Progress Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs text-black/50 dark:text-white/50"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors",
                      i === 0 && formState.product_name ?
                        "bg-blue-500"
                      : "bg-black/20 dark:bg-white/20",
                      i === 1 && formState.product_category ?
                        "bg-blue-500"
                      : "bg-black/20 dark:bg-white/20",
                      i === 2 && formState.product_description ?
                        "bg-blue-500"
                      : "bg-black/20 dark:bg-white/20",
                    )}
                    animate={{
                      scale:
                        (
                          (i === 0 && formState.product_name) ||
                          (i === 1 && formState.product_category) ||
                          (i === 2 && formState.product_description)
                        ) ?
                          1.2
                        : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  />
                ))}
              </div>
              <span>
                {
                  [
                    formState.product_name,
                    formState.product_category,
                    formState.product_description,
                  ].filter(Boolean).length
                }
                /3 required fields
              </span>
            </motion.div>

            {/* Product Name & Category Row */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {/* Language Selector */}
              <div>
                <label className="text-xs font-medium text-black/60 dark:text-white/60 mb-1.5 block">
                  Language
                </label>
                <select
                  value={language ?? ""}
                  onChange={(e) =>
                    setLanguage(
                      e.target.value === "" ? null : (e.target.value as any),
                    )
                  }
                  className="w-full px-3 py-2 bg-black/5 dark:bg-white/5 border border-transparent rounded-lg outline-none transition-all text-sm dark:text-white focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Auto Detect</option>
                  <option value="pidgin">Pidgin English</option>
                  <option value="english">English</option>
                  <option value="yoruba">Yoruba</option>
                  <option value="igbo">Igbo</option>
                  <option value="hausa">Hausa</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-black/60 dark:text-white/60 mb-1.5 block">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formState.product_name}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        product_name: e.target.value,
                      }))
                    }
                    placeholder="e.g., Jollof Rice, The Midnight Library..."
                    className={cn(
                      "w-full px-3 py-2 bg-black/5 dark:bg-white/5 border rounded-lg outline-none transition-all text-sm dark:text-white",
                      "focus:ring-1 focus:ring-blue-500 focus:border-transparent",
                      errors.product_name ? "border-red-500" : (
                        "border-transparent"
                      ),
                    )}
                  />
                  {errors.product_name && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-xs text-red-500 mt-1"
                    >
                      {errors.product_name}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-black/60 dark:text-white/60 mb-1.5 block">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full h-9 px-3 bg-black/5 dark:bg-white/5 text-black dark:text-white border border-transparent hover:border-black/10 dark:hover:border-white/10 rounded-lg justify-between"
                      >
                        <span className="text-sm capitalize">
                          {formState.product_category}
                        </span>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-neutral-900 border-black/10 dark:border-white/10">
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <DropdownMenuItem
                          key={cat}
                          onSelect={() => handleCategoryChange(cat)}
                          className="flex items-center justify-between gap-2 capitalize"
                        >
                          <span>{cat}</span>
                          {formState.product_category === cat && (
                            <Check className="w-4 h-4 text-blue-500" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {errors.product_category && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-xs text-red-500 mt-1"
                    >
                      {errors.product_category}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Product Description Textarea */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <label className="text-xs font-medium text-black/60 dark:text-white/60 mb-1.5 flex justify-between items-center">
                <span>
                  Product Description <span className="text-red-500">*</span>
                </span>
                <span className="text-black/40 dark:text-white/40 text-xs">
                  {charCount}/500
                </span>
              </label>
              <Textarea
                value={formState.product_description}
                placeholder="Describe the product, its key features, and what makes it special..."
                className={cn(
                  "w-full rounded-lg px-3 py-2 bg-black/5 dark:bg-white/5 border dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 resize-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-transparent",
                  "min-h-[100px]",
                  errors.product_description ? "border-red-500" : (
                    "border-transparent"
                  ),
                )}
                ref={textareaRef}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {errors.product_description && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-xs text-red-500 mt-1"
                >
                  {errors.product_description}
                </motion.p>
              )}
            </motion.div>

            {/* Advanced Section Toggle */}
            <>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-xs font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors py-2 self-start"
              >
                {showAdvanced ?
                  <ChevronUp className="w-4 h-4" />
                : <ChevronDown className="w-4 h-4" />}
                User Context{" "}
                <span className="text-black/40 dark:text-white/40">
                  (optional)
                </span>
              </motion.button>

              {/* Advanced Section */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 border-t border-black/10 dark:border-white/10 pt-3"
                  >
                    {/* User Input Mode Toggle */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-2 p-2 bg-black/5 dark:bg-white/5 rounded-lg w-fit"
                    >
                      <button
                        onClick={() => setUserInputMode("id")}
                        className={cn(
                          "px-3 py-1 text-xs font-medium rounded transition-all",
                          userInputMode === "id" ?
                            "bg-blue-500 text-white"
                          : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white",
                        )}
                      >
                        Existing User
                      </button>
                      <button
                        onClick={() => setUserInputMode("persona")}
                        className={cn(
                          "px-3 py-1 text-xs font-medium rounded transition-all",
                          userInputMode === "persona" ?
                            "bg-blue-500 text-white"
                          : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white",
                        )}
                      >
                        New Persona
                      </button>
                    </motion.div>

                    {/* User Context Validation Error */}
                    {errors.user_context && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-xs text-red-500"
                      >
                        {errors.user_context}
                      </motion.p>
                    )}

                    {/* User ID Input */}
                    <AnimatePresence mode="wait">
                      {userInputMode === "id" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <label className="text-xs font-medium text-black/60 dark:text-white/60 mb-1.5 block">
                            User ID
                          </label>
                          <input
                            type="text"
                            value={formState.user_id}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                user_id: e.target.value,
                              }))
                            }
                            placeholder="e.g., user_12345"
                            className="w-full px-3 py-2 bg-black/5 dark:bg-white/5 border border-transparent rounded-lg outline-none transition-all text-sm dark:text-white focus:ring-1 focus:ring-blue-500"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* User Persona Textarea */}
                    <AnimatePresence mode="wait">
                      {userInputMode === "persona" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <label className="text-xs font-medium text-black/60 dark:text-white/60 mb-1.5 block">
                            User Persona
                          </label>
                          <Textarea
                            value={formState.user_persona}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                user_persona: e.target.value,
                              }))
                            }
                            placeholder="e.g., A 28-year-old Yoruba professional in Lagos, loves spicy food, prefers authentic Nigerian cuisine..."
                            className="w-full px-3 py-2 bg-black/5 dark:bg-white/5 border border-transparent rounded-lg dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 resize-none focus-visible:ring-1 focus-visible:ring-blue-500 min-h-[80px]"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Conditional Business Name Field */}
                    <AnimatePresence>
                      {(formState.product_category === "food" ||
                        formState.product_category === "business") && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <label className="text-xs font-medium text-black/60 dark:text-white/60 mb-1.5 block">
                            Business Name
                          </label>
                          <input
                            type="text"
                            value={formState.business_name}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                business_name: e.target.value,
                              }))
                            }
                            placeholder="e.g., Mama Fola's Kitchen, TechStart Inc..."
                            className={cn(
                              "w-full px-3 py-2 bg-black/5 dark:bg-white/5 border rounded-lg outline-none transition-all text-sm dark:text-white focus:ring-1 focus:ring-blue-500",
                              errors.business_name ? "border-red-500" : (
                                "border-transparent"
                              ),
                            )}
                          />
                          {errors.business_name && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="text-xs text-red-500 mt-1"
                            >
                              {errors.business_name}
                            </motion.p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </>

            {/* End of form fields */}
          </div>

          {/* Bottom Toolbar - Fixed Position */}
          <motion.div
            className="h-14 bg-black/5 dark:bg-white/5 rounded-b-xl flex items-center flex-shrink-0 mt-3 border-t border-black/5 dark:border-white/5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
              <div className="flex items-center gap-2 hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 h-8 pl-1 pr-2 text-xs rounded-md dark:text-white hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={selectedModel}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-1"
                        >
                          {MODEL_ICONS[selectedModel]}
                          {selectedModel}
                          <ChevronDown className="w-3 h-3 opacity-50" />
                        </motion.div>
                      </AnimatePresence>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className={cn(
                      "min-w-[10rem]",
                      "border-black/10 dark:border-white/10",
                      "bg-gradient-to-b from-white via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800",
                    )}
                  >
                    {AI_MODELS.map((model) => (
                      <DropdownMenuItem
                        key={model}
                        onSelect={() => setSelectedModel(model)}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          {MODEL_ICONS[model] || (
                            <Bot className="w-4 h-4 opacity-50" />
                          )}
                          <span>{model}</span>
                        </div>
                        {selectedModel === model && (
                          <Check className="w-4 h-4 text-blue-500" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-0.5" />

                <label
                  className={cn(
                    "rounded-lg p-2 bg-black/5 dark:bg-white/5 cursor-pointer",
                    "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                    "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white",
                  )}
                  aria-label="Attach file"
                >
                  <input
                    type="file"
                    className="hidden"
                  />
                  <Paperclip className="w-4 h-4 transition-colors" />
                </label>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors hidden"
                  aria-label="Clear form"
                  title="Clear form"
                >
                  <X className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  className={cn(
                    "rounded-lg p-2 transition-opacity duration-200",
                    requiredFieldsFilled && !isPending ?
                      "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                    : "bg-black/5 dark:bg-white/5",
                  )}
                  aria-label="Send message"
                  disabled={!requiredFieldsFilled || isPending}
                  onClick={handleSubmit}
                >
                  {isPending ?
                    <Loader className="w-4 h-4 dark:text-white animate-spin" />
                  : <ArrowRight
                      className={cn(
                        "w-4 h-4 dark:text-white transition-opacity duration-200",
                        requiredFieldsFilled ? "opacity-100" : "opacity-30",
                      )}
                    />
                  }
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scrollbar styling */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: rgb(0 0 0 / 0.1);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgb(0 0 0 / 0.2);
        }
        :is(.dark) div::-webkit-scrollbar-thumb {
          background: rgb(255 255 255 / 0.1);
        }
        :is(.dark) div::-webkit-scrollbar-thumb:hover {
          background: rgb(255 255 255 / 0.2);
        }
      `}</style>

      {/* Review Dialog */}
      <ReviewDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        response={dialogResponse}
        isLoading={isPending}
      />
    </div>
  );
}
