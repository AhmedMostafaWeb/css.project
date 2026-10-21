
/* ============================================================
   STYLE STORE — PART 1
   WISHLIST SYSTEM / نظام المفضلة
============================================================ */


/* ============================================================
   SECTION 1: SETTINGS / الإعدادات
============================================================ */

var WISHLIST_STORAGE_KEY = "styleStoreWishlist";


/* ============================================================
   SECTION 2: STORAGE / الحفظ والاسترجاع
============================================================ */

// GET WISHLIST / جلب المنتجات المحفوظة
function getWishlist() {
    try {
        var saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
        var products = saved ? JSON.parse(saved) : [];

        return Array.isArray(products) ? products : [];
    } catch (error) {
        console.error("Wishlist read error:", error);
        return [];
    }
}


// SAVE WISHLIST / حفظ المنتجات
function saveWishlist(products) {
    try {
        localStorage.setItem(
            WISHLIST_STORAGE_KEY,
            JSON.stringify(products)
        );

        return true;
    } catch (error) {
        console.error("Wishlist save error:", error);
        alert("Could not save your wishlist. Please check browser storage.");
        return false;
    }
}


/* ============================================================
   SECTION 3: FIND PRODUCT CARD / تحديد كارت المنتج
============================================================ */

// البحث عن كارت المنتج من مكان وجود القلب
function findWishlistCard(heart) {
    var current = heart;

    // نبحث في العناصر الأب حتى نجد العنصر الذي يحتوي
    // على صورة واسم المنتج، حتى لو اختلف اسم الكلاس
    for (var i = 0; current && i < 8; i++) {
        if (
            current.querySelector &&
            current.querySelector("img") &&
            current.querySelector("h2, h3, .product-title")
        ) {
            return current;
        }

        current = current.parentElement;
    }

    return null;
}


/* ============================================================
   SECTION 4: READ PRODUCT DATA / قراءة بيانات المنتج
============================================================ */

// إنشاء معرّف للمنتج من الاسم والصورة لتقليل تكرار المعرفات
function createProductId(name, image) {
    var source = String(name || "") + "-" + String(image || "");

    return source
        .toLowerCase()
        .trim()
        .replace(/https?:\/\//g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 180);
}


// قراءة البيانات من كارت المنتج
function getProductData(card) {
    if (!card) {
        return null;
    }

    var image = card.querySelector("img");
    var title = card.querySelector("h2, h3, .product-title");

    var priceElement = card.querySelector(
        ".women-price, .men-price, .kids-price, " +
        ".product-price, .new-price, .jeans-new-price, " +
        ".arrival-price, .men-new-price, .women-new-price, " +
        ".kids-new-price, [class*='price']"
    );

    if (!image || !title) {
        return null;
    }

    var name = title.textContent.trim();
    var imagePath = image.getAttribute("src") || image.src || "";
    var priceText = priceElement
        ? priceElement.textContent.trim()
        : "";

    var priceMatch = priceText
        .replace(/,/g, "")
        .match(/[0-9]+(?:\.[0-9]+)?/);

    // تحديد فئة المنتج حسب كلاس الكارت
    var category = "products";

    if (card.closest(".women-card") || card.classList.contains("women-card")) {
        category = "women";
    } else if (
        card.closest(".men-card") ||
        card.classList.contains("men-card")
    ) {
        category = "men";
    } else if (
        card.closest(".kids-card") ||
        card.classList.contains("kids-card")
    ) {
        category = "kids";
    } else if (
        card.closest(".jeans-card") ||
        card.classList.contains("jeans-card")
    ) {
        category = "jeans";
    }

    return {
        id: createProductId(name, imagePath),
        name: name,
        image: imagePath,
        imageAlt: image.getAttribute("alt") || name,
        price: priceMatch ? Number(priceMatch[0]) : 0,
        priceText: priceText,
        description: card.querySelector("p")
            ? card.querySelector("p").textContent.trim()
            : "",
        category: category,
        page: location.pathname.split("/").pop()
    };
}


/* ============================================================
   SECTION 5: HEART APPEARANCE / شكل القلب
============================================================ */

function updateWishlistHeart(heart, isActive) {
    heart.classList.toggle("is-wishlisted", isActive);

    heart.setAttribute(
        "aria-pressed",
        isActive ? "true" : "false"
    );

    heart.setAttribute(
        "aria-label",
        isActive ? "Remove from wishlist" : "Add to wishlist"
    );

    heart.setAttribute(
        "title",
        isActive ? "Remove from wishlist" : "Add to wishlist"
    );

    // تحديث لون القلب بدون تغيير ملف CSS
    heart.style.color = isActive ? "#e53935" : "";
}


// هل المنتج موجود في المفضلة؟
function isProductWishlisted(productId) {
    return getWishlist().some(function (product) {
        return product.id === productId;
    });
}


// تحديث كل القلوب الخاصة بنفس المنتج في الصفحة
function updateMatchingWishlistHearts(productId, isActive) {
    var selectors = [
        ".women-wishlist-heart",
        ".men-wishlist-heart",
        ".kids-wishlist-heart",
        ".jeans-wishlist-heart"
    ].join(", ");

    document.querySelectorAll(selectors).forEach(function (heart) {
        var card = findWishlistCard(heart);
        var product = getProductData(card);

        if (product && product.id === productId) {
            updateWishlistHeart(heart, isActive);
        }
    });
}


/* ============================================================
   SECTION 6: ADD OR REMOVE / الإضافة والحذف
============================================================ */

function toggleWishlistProduct(product, heart) {
    if (!product) {
        return;
    }

    var products = getWishlist();

    var index = products.findIndex(function (savedProduct) {
        return savedProduct.id === product.id;
    });

    // المنتج موجود بالفعل: احذفه
    if (index !== -1) {
        products.splice(index, 1);

        if (saveWishlist(products)) {
            updateMatchingWishlistHearts(product.id, false);

            // تحديث القلب الحالي حتى لو لم يُعثر على كارت آخر
            updateWishlistHeart(heart, false);

            if (document.querySelector(".wl-grid")) {
                renderWishlistPage();
            }
        }

        return;
    }

    // المنتج غير موجود: أضفه
    products.push(product);

    if (saveWishlist(products)) {
        updateMatchingWishlistHearts(product.id, true);
        updateWishlistHeart(heart, true);
    }
}


/* ============================================================
   SECTION 7: INITIALIZE HEARTS / تجهيز القلوب
============================================================ */

var WISHLIST_HEART_SELECTORS = [
    ".women-wishlist-heart",
    ".men-wishlist-heart",
    ".kids-wishlist-heart",
    ".jeans-wishlist-heart"
].join(", ");


function initializeWishlistHearts() {
    document.querySelectorAll(WISHLIST_HEART_SELECTORS).forEach(
        function (heart) {
            var card = findWishlistCard(heart);
            var product = getProductData(card);

            if (!product) {
                return;
            }

            updateWishlistHeart(
                heart,
                isProductWishlisted(product.id)
            );

            // علامة للتأكد من أن الزر تم فحصه
            heart.setAttribute("data-wishlist-ready", "true");
        }
    );
}


/* ============================================================
   SECTION 8: SAFE HTML / حماية النصوص
============================================================ */

function escapeWishlistHTML(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}


/* ============================================================
   SECTION 9: WISHLIST PAGE / صفحة المفضلة
============================================================ */

function createWishlistCard(product) {
    var id = escapeWishlistHTML(product.id);
    var name = escapeWishlistHTML(product.name);
    var image = escapeWishlistHTML(product.image);
    var alt = escapeWishlistHTML(product.imageAlt || product.name);
    var price = escapeWishlistHTML(product.priceText || "");

    var description = escapeWishlistHTML(product.description || "");

    return `
        <article class="wl-product" data-wishlist-product-id="${id}">
            <a href="product.html?id=${encodeURIComponent(product.id)}"
               class="wl-product-image">
                <img src="${image}" alt="${alt}" loading="lazy">
            </a>

            <div class="wl-product-info">
                <h3>${name}</h3>

                <p class="wl-product-description">${description}</p>

                <div class="wl-price-row">
                    <strong>${price}</strong>
                </div>

                <a href="product.html?id=${encodeURIComponent(product.id)}"
                   class="wl-primary-btn">
                    View Product
                </a>

                <button type="button"
                        class="wl-remove-button"
                        data-remove-wishlist="${id}">
                    Remove from Wishlist
                </button>
            </div>
        </article>
    `;
}


function renderWishlistPage() {
    var grid = document.querySelector(".wl-grid");

    if (!grid) {
        return;
    }

    var products = getWishlist();

    if (products.length === 0) {
        grid.innerHTML = `
            <p class="wishlist-empty">
                Your wishlist is empty.
            </p>
        `;
        return;
    }

    grid.innerHTML = products.map(function (product) {
        return createWishlistCard(product);
    }).join("");
}


/* ============================================================
   SECTION 10: REMOVE BUTTON / زر إزالة المنتج
============================================================ */

function initializeWishlistRemoveButtons() {
    var grid = document.querySelector(".wl-grid");

    if (!grid || grid.dataset.wishlistRemoveReady === "true") {
        return;
    }

    grid.dataset.wishlistRemoveReady = "true";

    grid.addEventListener("click", function (event) {
        var button = event.target.closest("[data-remove-wishlist]");

        if (!button) {
            return;
        }

        var productId = button.getAttribute("data-remove-wishlist");

        var products = getWishlist().filter(function (product) {
            return product.id !== productId;
        });

        if (saveWishlist(products)) {
            renderWishlistPage();
        }
    });
}


/* ============================================================
   SECTION 11: CLICK HANDLER / التعامل مع الضغط
============================================================ */

function initializeWishlistClickHandler() {
    if (document.documentElement.dataset.wishlistClickReady === "true") {
        return;
    }

    document.documentElement.dataset.wishlistClickReady = "true";

    // استقبال الضغط على القلوب حتى لو تغير ترتيب عناصر الكارت
    document.addEventListener("click", function (event) {
        var heart = event.target.closest(WISHLIST_HEART_SELECTORS);

        if (!heart) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        var card = findWishlistCard(heart);
        var product = getProductData(card);

        if (!product) {
            console.error(
                "Wishlist: Could not find product image or title.",
                heart
            );
            return;
        }

        toggleWishlistProduct(product, heart);
    });
}


/* ============================================================
   SECTION 12: START / تشغيل النظام
============================================================ */

function initializeWishlistSystem() {
    initializeWishlistClickHandler();
    initializeWishlistHearts();
    renderWishlistPage();
    initializeWishlistRemoveButtons();
}


if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeWishlistSystem
    );
} else {
    initializeWishlistSystem();
}

/* ================= END OF PART 1 ================= */

















































































// ============================================
// الجزء الخاص بترجمة الموقع بالكامل
// WEBSITE FULL TRANSLATION SECTION
// ============================================
document.addEventListener("DOMContentLoaded", function () {
    const languageButtons = document.querySelectorAll(
        ".language-option[data-language]"
    );

    const languageCode = document.querySelector(".language-code");
    const languageName = document.querySelector(".language-name");
    const languageDropdown = document.querySelector(".language-dropdown");

    const translations = {
      
    // CHECKOUT PAGE

    "Complete Your Order": "أكمل طلبك",
    "Secure checkout • Fast delivery • Easy returns": "دفع آمن • توصيل سريع • إرجاع سهل",
    "Confirmation": "تأكيد الطلب",

    "YOUR DETAILS": "بياناتك",
    "Customer Information": "معلومات العميل",
    "Full Name": "الاسم بالكامل",
    "Enter your full name": "أدخل اسمك بالكامل",
    "Enter your phone number": "أدخل رقم هاتفك",
    "Enter your email address": "أدخل بريدك الإلكتروني",

    "DELIVERY ADDRESS": "عنوان التوصيل",
    "Street Address": "عنوان الشارع",
    "House number, street name": "رقم المنزل واسم الشارع",
    "Enter your city": "أدخل مدينتك",
    "Country": "الدولة",
    "Egypt": "مصر",
    "Saudi Arabia": "المملكة العربية السعودية",
    "United Arab Emirates": "الإمارات العربية المتحدة",
    "Kuwait": "الكويت",
    "Add any special delivery instructions...": "أضف أي تعليمات خاصة بالتوصيل...",

    "DELIVERY METHOD": "طريقة التوصيل",
    "Choose Your Delivery": "اختر طريقة التوصيل",
    "Delivery within 3–5 business days": "التوصيل خلال 3 إلى 5 أيام عمل",
    "Faster delivery within 1–2 business days": "توصيل أسرع خلال يوم إلى يومي عمل",

    "PAYMENT METHOD": "طريقة الدفع",
    "Choose Payment": "اختر طريقة الدفع",
    "Pay when your order arrives.": "ادفع عند وصول طلبك.",
    "Secure payment using your bank card.": "دفع آمن باستخدام بطاقتك البنكية.",
    "Card Number": "رقم البطاقة",
    "Cardholder Name": "اسم حامل البطاقة",
    "Name on card": "الاسم المكتوب على البطاقة",
    "Expiry Date": "تاريخ انتهاء الصلاحية",
    "CVV": "رمز أمان البطاقة",

    "SPECIAL OFFER": "عرض خاص",
    "Have a Promo Code?": "هل لديك كود خصم؟",

    "Secure Checkout": "إتمام طلب آمن",
    "Your information is protected.": "معلوماتك محمية.",
    "Easy Returns": "إرجاع سهل",
    "Simple and convenient returns.": "إجراءات إرجاع سهلة ومريحة.",
    "Premium Quality": "جودة فائقة",
    "Carefully selected fashion pieces.": "قطع أزياء مختارة بعناية.",

    "MEN'S COLLECTION": "مجموعة الرجال",
    "Slim Fit Blue Jeans": "جينز أزرق بقصة ضيقة",
    "Size: M": "المقاس: M",
    "Quantity: 1": "الكمية: 1",
    "Including shipping": "شامل الشحن",
    "Place Order": "تأكيد الطلب",
    "Secure Payment": "دفع آمن",
    "Your payment information is encrypted": "معلومات الدفع الخاصة بك مشفرة",
    "and protected.": "ومحمية.",
    "Free support with every order": "دعم مجاني مع كل طلب",
    "Easy returns and exchanges": "إرجاع واستبدال بسهولة",
    "Carefully packed with care": "تغليف بعناية",

    "NEED HELP?": "هل تحتاج إلى مساعدة؟",
    "Checkout FAQ": "الأسئلة الشائعة حول إتمام الطلب",
    "How long will my order take?": "كم يستغرق وصول طلبي؟",
    "Standard orders usually arrive within": "تصل الطلبات العادية عادةً خلال",
    "3–5 business days.": "3 إلى 5 أيام عمل.",
    "Can I return my order?": "هل يمكنني إرجاع طلبي؟",
    "Yes. Eligible items can be returned": "نعم، يمكن إرجاع المنتجات المؤهلة",
    "according to our return policy.": "وفقًا لسياسة الإرجاع الخاصة بنا.",
    "Is my payment secure?": "هل عملية الدفع آمنة؟",
    "Yes. We take your privacy and payment": "نعم، نولي خصوصيتك وأمان الدفع",
    "security seriously.": "اهتمامًا كبيرًا.",
    "Need more help?": "هل تحتاج إلى مزيد من المساعدة؟",
    "Our customer support team is ready": "فريق خدمة العملاء لدينا مستعد",
    "to help you with your order.": "لمساعدتك بشأن طلبك.",

    "THANK YOU FOR CHOOSING STYLE STORE": "شكرًا لاختيارك STYLE STORE",
    "Your Style. Your Confidence.": "أسلوبك. ثقتك بنفسك.",
    "Premium fashion designed for everyday life.": "أزياء راقية مصممة لتناسب حياتك اليومية."
,
      
    // WISHLIST PAGE

    "My Wishlist": "قائمة المفضلة",
    "Search": "بحث",
    "Wishlist": "المفضلة",
    "YOUR STYLE, YOUR COLLECTION": "أسلوبك، مجموعتك",
    "Your Wishlist": "قائمة المفضلة الخاصة بك",
    "A place for the pieces you love.": "مكان للقطع التي تحبها.",
    "Discover your favorites, revisit your style,": "اكتشف قطعك المفضلة، وجدّد إطلالتك،",
    "and keep inspiration close at hand.": "واجعل الإلهام دائمًا في متناول يدك.",
    "Explore Collection": "استكشف المجموعة",
    "CURATED FOR YOUR PERSONAL STYLE": "مختارة لتناسب أسلوبك الشخصي",
    "Fashion collection": "مجموعة أزياء",
    "STYLE EDITION": "إصدار الأناقة",
    "Find what feels like you.": "اعثر على ما يعبر عنك.",
    "THE DETAILS": "التفاصيل",
    "Make the look.": "اصنع إطلالتك.",

    "Your Favorites": "قطعك المفضلة",
    "Keep your favorite styles together.": "اجمع أنماطك المفضلة في مكان واحد.",
    "Timeless Style": "أناقة لا تزول",
    "Find pieces for every occasion.": "اعثر على قطع تناسب كل مناسبة.",
    "Shop Your Way": "تسوق بأسلوبك",
    "Explore collections at your own pace.": "استكشف المجموعات بالوتيرة التي تناسبك.",

    "YOUR PERSONAL EDIT": "اختياراتك الشخصية",
    "Pieces Worth Keeping": "قطع تستحق الاحتفاظ بها",
    "Your personally selected pieces, all in one place.": "القطع التي اخترتها بنفسك، كلها في مكان واحد.",
    "Discover More": "اكتشف المزيد",
    "All Pieces": "كل القطع",

    "A LITTLE STYLE INSPIRATION": "لمسة من إلهام الأناقة",
    "Great style starts": "الأناقة المميزة تبدأ",
    "with the details.": "من التفاصيل.",
    "Discover pieces that make getting dressed": "اكتشف قطعًا تجعل اختيار ملابسك",
    "feel a little more special.": "أكثر تميزًا.",
    "Explore the Collection": "استكشف المجموعة",
    "Wear what": "ارتدِ ما",
    "you love.": "تحب.",
    "YOUR STYLE. YOUR STORY.": "أسلوبك. قصتك.",

    "Quality First": "الجودة أولًا",
    "Thoughtful style for your wardrobe.": "أناقة مختارة بعناية لخزانة ملابسك.",
    "Easy Shopping": "تسوق سهل",
    "Your Personal Style": "أسلوبك الشخصي",
    "Find inspiration in every collection.": "اعثر على الإلهام في كل مجموعة.",
    "Discover your style. Celebrate every detail.": "اكتشف أسلوبك واحتفِ بكل التفاصيل.",
    "© 2026 STYLE STORE. All rights reserved.": "© 2026 STYLE STORE. جميع الحقوق محفوظة."
,
      
    // CART PAGE

    "STYLE STORE CHECKOUT": "إتمام الطلب - STYLE STORE",
    "Your Shopping Cart": "سلة التسوق الخاصة بك",
    "Review your items, enter your shipping information,": "راجع منتجاتك وأدخل معلومات الشحن الخاصة بك،",
    "choose your delivery method, and complete your order.": "واختر طريقة التوصيل وأكمل طلبك.",

    "Shopping Cart": "سلة التسوق",
    "Review the products you selected.": "راجع المنتجات التي اخترتها.",
    "NEW COLLECTION": "تشكيلة جديدة",
    "Classic T-Shirt": "تيشيرت كلاسيكي",
    "Premium casual T-shirt designed for": "تيشيرت كاجوال فاخر مصمم لتوفير",
    "everyday comfort and modern style.": "الراحة اليومية والأناقة العصرية.",
    "Color: Black": "اللون: أسود",
    "Size: M": "المقاس: M",
    "Quantity: 1": "الكمية: 1",
    "Remove": "إزالة",

    "Shipping Information": "معلومات الشحن",
    "Enter the information required for delivery.": "أدخل المعلومات المطلوبة للتوصيل.",
    "First Name": "الاسم الأول",
    "Enter your first name": "أدخل اسمك الأول",
    "Last Name": "اسم العائلة",
    "Enter your last name": "أدخل اسم العائلة",
    "Phone Number": "رقم الهاتف",
    "Enter your phone number": "أدخل رقم هاتفك",
    "Email Address": "البريد الإلكتروني",
    "Enter your email address": "أدخل بريدك الإلكتروني",
    "Governorate": "المحافظة",
    "Select Governorate": "اختر المحافظة",
    "Cairo": "القاهرة",
    "Giza": "الجيزة",
    "Alexandria": "الإسكندرية",
    "Gharbia": "الغربية",
    "Dakahlia": "الدقهلية",
    "Sharqia": "الشرقية",
    "Qalyubia": "القليوبية",
    "Monufia": "المنوفية",
    "Beheira": "البحيرة",
    "Kafr El Sheikh": "كفر الشيخ",
    "Other": "أخرى",
    "City": "المدينة",
    "Enter your city": "أدخل مدينتك",
    "Full Address": "العنوان بالكامل",
    "Street, building number, apartment...": "الشارع، رقم المبنى، الشقة...",
    "Delivery Notes": "ملاحظات التوصيل",
    "Any additional instructions for the delivery...": "أي تعليمات إضافية للتوصيل...",

    "Delivery Method": "طريقة التوصيل",
    "Choose the delivery option that suits you.": "اختر طريقة التوصيل المناسبة لك.",
    "Standard Delivery": "التوصيل العادي",
    "Delivery within 3–5 business days.": "التوصيل خلال 3 إلى 5 أيام عمل.",
    "Express Delivery": "التوصيل السريع",
    "Faster delivery within 1–2 business days.": "توصيل أسرع خلال يوم إلى يومي عمل.",

    "Payment Method": "طريقة الدفع",
    "Select your preferred payment method.": "اختر طريقة الدفع المفضلة لديك.",
    "Cash on Delivery": "الدفع عند الاستلام",
    "Pay when your order arrives at your door.": "ادفع عند وصول طلبك إلى باب منزلك.",
    "Credit / Debit Card": "بطاقة ائتمان / بطاقة خصم",
    "Pay securely using your bank card.": "ادفع بأمان باستخدام بطاقتك البنكية.",

    "Promo Code": "كود الخصم",
    "Have a discount code?": "هل لديك كود خصم؟",
    "Enter promo code": "أدخل كود الخصم",
    "Apply Code": "تطبيق الكود",

    "Why Shop With STYLE STORE?": "لماذا تتسوق من STYLE STORE؟",
    "Everything you need for a comfortable shopping experience.": "كل ما تحتاجه لتجربة تسوق مريحة.",
    "Secure Shopping": "تسوق آمن",
    "Your shopping experience is designed": "صُممت تجربة التسوق الخاصة بك",
    "with security and privacy in mind.": "مع مراعاة الأمان والخصوصية.",
    "Quality Products": "منتجات عالية الجودة",
    "Carefully selected fashion pieces": "قطع أزياء مختارة بعناية",
    "for modern everyday style.": "لإطلالة عصرية كل يوم.",
    "Fast Delivery": "توصيل سريع",
    "Reliable delivery options designed": "خيارات توصيل موثوقة مصممة",
    "to get your order to you quickly.": "لإيصال طلبك إليك بسرعة.",
    "Easy Returns": "إرجاع سهل",
    "Simple return policies designed": "سياسات إرجاع بسيطة مصممة",
    "to make shopping easier.": "لجعل التسوق أسهل.",

    "Frequently Asked Questions": "الأسئلة الشائعة",
    "Find answers to common questions about your order.": "اعثر على إجابات للأسئلة الشائعة حول طلبك.",
    "How long does delivery take?": "كم يستغرق التوصيل؟",
    "Standard delivery usually takes 3–5 business days,": "يستغرق التوصيل العادي عادةً من 3 إلى 5 أيام عمل،",
    "while express delivery takes approximately 1–2 business days.": "بينما يستغرق التوصيل السريع من يوم إلى يومي عمل تقريبًا.",
    "Can I change my order?": "هل يمكنني تعديل طلبي؟",
    "Order changes depend on the order status and": "تعتمد إمكانية تعديل الطلب على حالته",
    "whether the order has already been shipped.": "وما إذا كان قد تم شحنه بالفعل.",
    "Can I return an item?": "هل يمكنني إرجاع منتج؟",
    "Eligible products can be returned according": "يمكن إرجاع المنتجات المؤهلة وفقًا",
    "to the store's return policy.": "لسياسة الإرجاع الخاصة بالمتجر.",
    "How can I contact customer support?": "كيف يمكنني التواصل مع خدمة العملاء؟",
    "You can contact STYLE STORE customer support": "يمكنك التواصل مع خدمة عملاء STYLE STORE",
    "for assistance with your order.": "للحصول على المساعدة بشأن طلبك.",

    "YOUR ORDER": "طلبك",
    "Order Summary": "ملخص الطلب",
    "Black / M / ×1": "أسود / M / ×1",
    "Subtotal": "المجموع الفرعي",
    "Shipping": "الشحن",
    "Discount": "الخصم",
    "Total": "الإجمالي",
    "Secure Checkout": "إتمام طلب آمن",
    "Your order information is handled": "تتم معالجة معلومات طلبك",
    "through a secure checkout experience.": "من خلال تجربة آمنة لإتمام الطلب.",
    "Place Order": "تأكيد الطلب",
    "By placing your order, you agree to our": "بتأكيد طلبك، فإنك توافق على",
    "terms, privacy policy, shipping policy,": "الشروط وسياسة الخصوصية وسياسة الشحن",
    "and return policy.": "وسياسة الإرجاع.",

    "Shop": "تسوق",
    "Customer Care": "خدمة العملاء",
    "Contact Us": "اتصل بنا",
    "Returns": "الإرجاع",
    "FAQ": "الأسئلة الشائعة",
    "Information": "معلومات",
    "Privacy Policy": "سياسة الخصوصية",
    "Terms & Conditions": "الشروط والأحكام",
    "Payment Methods": "طرق الدفع",
    "About STYLE STORE": "عن STYLE STORE",
    "© 2026 STYLE STORE. All Rights Reserved.": "© 2026 STYLE STORE. جميع الحقوق محفوظة."
,
      
    // JEANS SPECIAL OFFERS PAGE

    "Denim Special Offers": "عروض الدنيم الخاصة",
    "Find your perfect fit. Explore timeless denim styles,": "اعثر على المقاس المثالي لك. اكتشف تصاميم دنيم كلاسيكية،",
    "modern cuts and exclusive prices.": "وقصّات عصرية وأسعار حصرية.",
    "SHOP DENIM": "تسوق الدنيم",
    "Denim Deals You’ll Love": "عروض دنيم ستحبها",
    "Discover your next favorite pair at a special price.": "اكتشف قطعتك المفضلة التالية بسعر خاص.",

    "MEN'S JEANS": "جينز رجالي",
    "WOMEN'S JEANS": "جينز حريمي",
    "CASUAL DENIM": "دنيم كاجوال",
    "BLACK DENIM": "دنيم أسود",
    "LIGHT WASH": "دنيم فاتح",
    "RELAXED DENIM": "دنيم بقصة مريحة",
    "TRENDING DENIM": "دنيم عصري",
    "EVERYDAY DENIM": "دنيم للاستخدام اليومي",
    "VINTAGE DENIM": "دنيم بطابع كلاسيكي",
    "PREMIUM DENIM": "دنيم فاخر",
    "DENIM FAVORITES": "قطع دنيم مفضلة",

    "Classic Blue Jeans": "جينز أزرق كلاسيكي",
    "A timeless denim essential for everyday outfits.": "قطعة دنيم أساسية وكلاسيكية للإطلالات اليومية.",
    "Slim Fit Denim Jeans": "جينز دنيم بقصة ضيقة",
    "A flattering slim fit with a versatile denim finish.": "قصة ضيقة أنيقة بلمسة دنيم متعددة الاستخدامات.",
    "Dark Wash Denim": "جينز دنيم داكن",
    "A clean dark wash for casual and smart-casual looks.": "لون داكن أنيق للإطلالات الكاجوال والكاجوال الأنيقة.",
    "High-Waist Jeans": "جينز بخصر مرتفع",
    "A modern high-rise silhouette with everyday comfort.": "تصميم عصري بخصر مرتفع وراحة للاستخدام اليومي.",
    "Relaxed Fit Jeans": "جينز بقصة مريحة",
    "A relaxed cut made for comfortable everyday wear.": "قصة مريحة مناسبة للارتداء اليومي.",
    "Essential Black Jeans": "جينز أسود أساسي",
    "A versatile black pair that works with almost anything.": "جينز أسود متعدد الاستخدامات يناسب معظم الإطلالات.",
    "Wide-Leg Denim Jeans": "جينز دنيم واسع الساقين",
    "A modern wide-leg cut for a relaxed, fashion-forward look.": "قصة عصرية واسعة الساقين لإطلالة مريحة ومواكبة للموضة.",
    "Straight-Leg Denim": "جينز بقصة مستقيمة",
    "A classic straight fit with a clean everyday profile.": "قصة مستقيمة كلاسيكية تناسب الإطلالات اليومية.",
    "Light Blue Denim": "جينز دنيم أزرق فاتح",
    "A fresh light wash for effortless weekend styling.": "لون فاتح ومنعش لإطلالات عطلة نهاية الأسبوع.",
    "Cropped Denim Jeans": "جينز دنيم قصير",
    "A versatile cropped style for sneakers and casual shoes.": "تصميم قصير يناسب الأحذية الرياضية والكاجوال.",
    "Loose Fit Jeans": "جينز واسع",
    "Extra room and easy movement for everyday comfort.": "مساحة إضافية وحرية في الحركة لراحة يومية.",
    "Distressed Style Jeans": "جينز بتصميم ممزق",
    "A contemporary denim look for relaxed streetwear outfits.": "تصميم دنيم عصري لإطلالات ستريت وير مريحة.",
    "Dark Straight Jeans": "جينز داكن بقصة مستقيمة",
    "Easy-to-style dark denim for day-to-night outfits.": "جينز داكن سهل التنسيق لإطلالات النهار والمساء.",
    "Classic Mom Jeans": "جينز موم كلاسيكي",
    "A relaxed vintage-inspired fit with a high waist.": "قصة مريحة مستوحاة من الطراز القديم بخصر مرتفع.",
    "Everyday Comfort Jeans": "جينز مريح للاستخدام اليومي",
    "A reliable everyday pair with a timeless denim style.": "جينز عملي للاستخدام اليومي بتصميم كلاسيكي.",
    "Modern Bootcut Jeans": "جينز بقصة بوت كت عصرية",
    "A balanced bootcut silhouette for a classic look.": "قصة بوت كت متناسقة لإطلالة كلاسيكية.",
    "Tapered Fit Denim": "جينز بقصة تضيق نحو الأسفل",
    "A modern tapered cut that pairs easily with casual footwear.": "قصة عصرية تضيق نحو الأسفل وتناسب الأحذية الكاجوال.",
    "Vintage Wash Jeans": "جينز بلون دنيم كلاسيكي",
    "A vintage-inspired wash for an effortlessly cool outfit.": "لون مستوحى من الطراز القديم لإطلالة أنيقة دون تكلف.",
    "Premium Classic Denim": "دنيم كلاسيكي فاخر",
    "A wardrobe staple with a clean finish and timeless appeal.": "قطعة أساسية في خزانة الملابس بلمسة أنيقة وتصميم لا يفقد رونقه.",
    "Signature Denim Jeans": "جينز دنيم مميز",
    "A versatile denim favorite to finish off your wardrobe.": "قطعة دنيم مفضلة ومتعددة الاستخدامات لإكمال خزانة ملابسك.",

    "Classic blue jeans": "جينز أزرق كلاسيكي",
    "Women's slim fit jeans": "جينز حريمي بقصة ضيقة",
    "Dark denim jeans": "جينز دنيم داكن",
    "Women's high waist jeans": "جينز حريمي بخصر مرتفع",
    "Relaxed fit jeans": "جينز بقصة مريحة",
    "Black denim jeans": "جينز دنيم أسود",
    "Women's wide leg jeans": "جينز حريمي واسع الساقين",
    "Straight leg denim": "جينز دنيم بقصة مستقيمة",
    "Light wash jeans": "جينز بلون فاتح",
    "Women's cropped jeans": "جينز حريمي قصير",
    "Loose fit jeans": "جينز واسع",
    "Women's distressed jeans": "جينز حريمي ممزق",
    "Dark straight jeans": "جينز داكن بقصة مستقيمة",
    "Women's mom jeans": "جينز موم حريمي",
    "Everyday denim jeans": "جينز للاستخدام اليومي",
    "Women's bootcut jeans": "جينز حريمي بقصة بوت كت",
    "Men's tapered jeans": "جينز رجالي بقصة تضيق نحو الأسفل",
    "Women's vintage denim": "جينز حريمي بطابع كلاسيكي",
    "Premium denim jeans": "جينز دنيم فاخر",
    "Women's fashion denim jeans": "جينز دنيم حريمي عصري"
,
      // KIDS SPECIAL OFFERS PAGE

"Kids Special Offers": "عروض خاصة للأطفال",
"Big smiles, little prices! Discover amazing deals on": "ابتسامات كبيرة وأسعار صغيرة! اكتشف عروضًا رائعة على",
"kids' fashion, shoes, toys and accessories.": "أزياء الأطفال والأحذية والألعاب والإكسسوارات.",
"SHOP NOW": "تسوق الآن",
"Our Special Offers": "عروضنا الخاصة",
"Top quality products for your little ones at the best prices.": "منتجات عالية الجودة لأطفالك بأفضل الأسعار.",

"BOYS CLOTHING": "ملابس الأولاد",
"Cool Print T-Shirt": "تيشيرت بطبعة عصرية",
"A soft everyday T-shirt for playtime and outings.": "تيشيرت ناعم للاستخدام اليومي واللعب والخروجات.",

"GIRLS DRESSES": "فساتين البنات",
"Floral Summer Dress": "فستان صيفي بنقوش الزهور",
"A cheerful floral dress for parties and sunny days.": "فستان مبهج بنقوش الزهور للحفلات والأيام المشمسة.",

"KIDS SHOES": "أحذية الأطفال",
"Sporty Everyday Sneakers": "حذاء رياضي للاستخدام اليومي",
"Comfortable sneakers for school and outdoor adventures.": "حذاء رياضي مريح للمدرسة والمغامرات في الهواء الطلق.",

"GIRLS SHOES": "أحذية البنات",
"Little Star Flats": "حذاء مسطح بنجمة صغيرة",
"Sweet, lightweight shoes for everyday outfits.": "حذاء خفيف وأنيق للإطلالات اليومية.",

"TOYS": "ألعاب",
"Remote Control Racer": "سيارة سباق بالتحكم عن بُعد",
"A fun racing toy for exciting playtime adventures.": "لعبة سباق ممتعة لمغامرات مليئة بالحماس.",

"BACKPACKS": "حقائب ظهر",
"Kids School Backpack": "حقيبة ظهر مدرسية للأطفال",
"A practical backpack for books, supplies and school days.": "حقيبة عملية للكتب والأدوات المدرسية وأيام الدراسة.",

"WINTER WEAR": "ملابس شتوية",
"Cozy Winter Jacket": "جاكيت شتوي دافئ",
"A warm outer layer for chilly mornings and winter trips.": "جاكيت دافئ للصباح البارد والرحلات الشتوية.",

"ACCESSORIES": "إكسسوارات",
"Winter Hat & Scarf Set": "طقم قبعة ووشاح شتوي",
"A soft matching set to keep little ones warm outdoors.": "طقم ناعم ومتناسق ليحافظ على دفء الأطفال في الخارج.",

"GIRLS CLOTHING": "ملابس البنات",
"Classic Denim Jacket": "جاكيت دنيم كلاسيكي",
"A versatile denim layer for cool and casual looks.": "جاكيت دنيم متعدد الاستخدامات للإطلالات العصرية والكاجوال.",

"Hoodie Sweatshirt": "سويت شيرت بغطاء رأس",
"A relaxed sweatshirt for school, play and weekends.": "سويت شيرت مريح للمدرسة واللعب وعطلات نهاية الأسبوع.",

"Colorful Building Blocks": "مكعبات بناء ملونة",
"A creative play set for building and learning through play.": "مجموعة ألعاب إبداعية للبناء والتعلم من خلال اللعب.",

"GIRLS ACCESSORIES": "إكسسوارات البنات",
"Pretty Hair Accessories Set": "طقم إكسسوارات شعر أنيق",
"Colorful accessories to complete everyday hairstyles.": "إكسسوارات ملونة لإكمال تسريحات الشعر اليومية.",

"BOYS SHOES": "أحذية الأولاد",
"Smart Casual Shoes": "أحذية كاجوال أنيقة",
"Comfortable shoes for family visits and special occasions.": "أحذية مريحة للزيارات العائلية والمناسبات الخاصة.",

"SLEEPWEAR": "ملابس نوم",
"Soft Pajama Set": "طقم بيجامة ناعم",
"A cozy matching set made for comfortable bedtime routines.": "طقم مريح ومتناسق لوقت نوم هادئ ومريح.",

"Classic Teddy Bear": "دبدوب كلاسيكي",
"A soft cuddly companion for playtime and bedtime.": "رفيق ناعم ولطيف للعب ووقت النوم.",

"BOYS ACCESSORIES": "إكسسوارات الأولاد",
"Everyday Baseball Cap": "كاب رياضي للاستخدام اليومي",
"A lightweight cap for sunny days and outdoor activities.": "كاب خفيف للأيام المشمسة والأنشطة الخارجية.",

"Color Pop Sneakers": "حذاء رياضي بألوان مميزة",
"Fun everyday sneakers designed for active little feet.": "حذاء رياضي ممتع ومناسب لأقدام الأطفال كثيرة الحركة.",

"Classic Polo Shirt": "قميص بولو كلاسيكي",
"A smart casual shirt for family outings and school events.": "قميص كاجوال أنيق للخروجات العائلية والفعاليات المدرسية.",

"Little Princess Party Dress": "فستان حفلات للأميرة الصغيرة",
"A special occasion dress for birthdays and celebrations.": "فستان مميز لأعياد الميلاد والاحتفالات.",

"EDUCATIONAL TOYS": "ألعاب تعليمية",
"Fun Learning Puzzle": "لعبة أحجية تعليمية ممتعة",
"A playful puzzle to encourage problem-solving and creativity.": "أحجية ممتعة لتنمية مهارات حل المشكلات والإبداع.",

"View Details": "عرض التفاصيل",
      // MEN SPECIAL OFFERS PAGE

"STYLE STORE EXCLUSIVE": "عروض حصرية من STYLE STORE",
"MEN SPECIAL OFFERS": "عروض خاصة للرجال",
"Discover premium men's fashion at special prices.": "اكتشف أزياء الرجال المميزة بأسعار خاصة.",
"Find your favorite style and upgrade your wardrobe.": "اعثر على أسلوبك المفضل وجدّد خزانة ملابسك.",
"Special Offers For Men": "عروض خاصة للرجال",
"20 Selected Products - Limited Offers": "20 منتجًا مختارًا - عروض لفترة محدودة",

"Formal Shirts": "قمصان رسمية",
"Classic White Formal Shirt": "قميص رسمي أبيض كلاسيكي",
"A timeless white shirt for formal occasions and office wear.": "قميص أبيض كلاسيكي يناسب المناسبات الرسمية والعمل.",

"Casual Shirts": "قمصان كاجوال",
"Light Blue Oxford Shirt": "قميص أكسفورد أزرق فاتح",
"A versatile shirt for everyday outfits and smart casual looks.": "قميص متعدد الاستخدامات للإطلالات اليومية والكاجوال الأنيقة.",

"Polo Shirts": "قمصان بولو",
"Premium Everyday Polo": "قميص بولو فاخر للاستخدام اليومي",
"A comfortable polo shirt with a clean and modern design.": "قميص بولو مريح بتصميم عصري وبسيط.",

"Modern Black Dress Shirt": "قميص أسود أنيق",
"A sophisticated black shirt for evening and formal styling.": "قميص أسود راقٍ لإطلالات المساء والمناسبات الرسمية.",

"Jeans": "جينز",
"Classic Blue Denim Jeans": "جينز دنيم أزرق كلاسيكي",
"Everyday denim with a timeless look and versatile style.": "جينز للاستخدام اليومي بمظهر كلاسيكي وأسلوب متعدد الاستخدامات.",

"Formal Trousers": "بناطيل رسمية",
"Tailored Charcoal Trousers": "بنطلون رمادي فحمي بقصة أنيقة",
"Smart tailored trousers for business and formal occasions.": "بنطلون أنيق بقصة متقنة للعمل والمناسبات الرسمية.",

"Smart Casual": "كاجوال أنيق",
"Smart Casual Outfit": "إطلالة كاجوال أنيقة",
"A modern outfit for outings, weekends and casual events.": "إطلالة عصرية للخروجات وعطلات نهاية الأسبوع والمناسبات الكاجوال.",

"T-Shirts": "تيشيرتات",
"Premium Cotton T-Shirt": "تيشيرت قطني فاخر",
"A soft cotton basic for comfortable everyday wear.": "تيشيرت قطني ناعم ومريح للاستخدام اليومي.",

"Jackets": "جاكيتات",
"Classic Casual Jacket": "جاكيت كاجوال كلاسيكي",
"A versatile jacket that completes a modern casual look.": "جاكيت متعدد الاستخدامات يكمل إطلالتك الكاجوال العصرية.",

"Outerwear": "ملابس خارجية",
"Lightweight Everyday Jacket": "جاكيت خفيف للاستخدام اليومي",
"A practical outer layer for changing weather and daily use.": "جاكيت عملي مناسب لتقلبات الطقس والاستخدام اليومي.",

"Essential Crew-Neck T-Shirt": "تيشيرت أساسي بياقة دائرية",
"A minimal wardrobe essential with a comfortable fit.": "قطعة أساسية بسيطة ومريحة لخزانة ملابسك.",

"Knitwear": "ملابس تريكو",
"Minimal Knit Sweater": "بلوفر تريكو بتصميم بسيط",
"A refined knit layer for a polished everyday wardrobe.": "قطعة تريكو أنيقة لإطلالة يومية مرتبة.",

"Blazers": "بليزرات",
"Modern Tailored Blazer": "بليزر عصري بقصة أنيقة",
"A refined blazer for business meetings and special events.": "بليزر راقٍ لاجتماعات العمل والمناسبات الخاصة.",

"Classic Dark Polo Shirt": "قميص بولو داكن كلاسيكي",
"A simple and versatile polo for effortless daily styling.": "قميص بولو بسيط ومتعدد الاستخدامات لإطلالة يومية سهلة.",

"Smart Everyday Shirt": "قميص أنيق للاستخدام اليومي",
"A versatile shirt that works from daytime to dinner.": "قميص متعدد الاستخدامات يناسب النهار والمساء.",

"Denim Jackets": "جاكيتات دنيم",
"Classic Denim Jacket": "جاكيت دنيم كلاسيكي",
"A timeless denim layer for relaxed and casual outfits.": "جاكيت دنيم كلاسيكي يناسب الإطلالات المريحة والكاجوال.",

"Sweatshirts": "سويت شيرت",
"Minimal Crew-Neck Sweatshirt": "سويت شيرت بسيط بياقة دائرية",
"Comfortable casual wear with a clean, understated look.": "ملابس كاجوال مريحة بمظهر بسيط وأنيق.",

"Smart Weekend Style": "إطلالة أنيقة لعطلة نهاية الأسبوع",
"A relaxed style for weekends, outings and social occasions.": "إطلالة مريحة لعطلات نهاية الأسبوع والخروجات والمناسبات الاجتماعية.",

"Premium Evening Shirt": "قميص سهرة فاخر",
"A refined shirt for dinners, celebrations and special events.": "قميص راقٍ للعشاء والاحتفالات والمناسبات الخاصة.",

"Premium Everyday Outerwear": "ملابس خارجية أنيقة للاستخدام اليومي",
"A versatile finishing layer for a confident, polished look.": "قطعة خارجية متعددة الاستخدامات لإطلالة أنيقة وواثقة.",

"Classic White Formal Shirt": "قميص رسمي أبيض كلاسيكي",
"Light Blue Casual Shirt": "قميص كاجوال أزرق فاتح",
"Premium Men's Polo Shirt": "قميص بولو رجالي فاخر",
"Black Formal Shirt": "قميص رسمي أسود",
"Classic Blue Denim Jeans": "جينز دنيم أزرق كلاسيكي",
"Men's Formal Trousers": "بنطلون رجالي رسمي",
"Smart Casual Men's Outfit": "إطلالة رجالية كاجوال أنيقة",
"Premium Cotton T-Shirt": "تيشيرت قطني فاخر",
"Classic Casual Jacket": "جاكيت كاجوال كلاسيكي",
"Lightweight Men's Jacket": "جاكيت رجالي خفيف",
"Crew Neck Men's T-Shirt": "تيشيرت رجالي بياقة دائرية",
"Minimal Knit Sweater": "بلوفر تريكو بسيط",
"Modern Tailored Blazer": "بليزر عصري بقصة أنيقة",
"Classic Dark Polo Shirt": "قميص بولو داكن كلاسيكي",
"Smart Everyday Men's Shirt": "قميص رجالي أنيق للاستخدام اليومي",
"Classic Denim Jacket": "جاكيت دنيم كلاسيكي",
"Men's Crew Neck Sweatshirt": "سويت شيرت رجالي بياقة دائرية",
"Smart Weekend Men's Style": "إطلالة رجالية أنيقة لعطلة نهاية الأسبوع",
"Premium Evening Shirt": "قميص سهرة فاخر",
"Premium Men's Outerwear": "ملابس خارجية رجالية فاخرة",
      // WOMEN SPECIAL OFFERS PAGE

"Womens Fashion Sale": "تخفيضات أزياء النساء",
"Women's Fashion Sale": "تخفيضات أزياء النساء",
"Discover your favorite styles at special prices.": "اكتشفي إطلالاتك المفضلة بأسعار مميزة.",
"Refresh your wardrobe with our exclusive women's collection.": "جددي خزانة ملابسك مع مجموعتنا الحصرية للنساء.",
"Exclusive Offers For Women": "عروض حصرية للنساء",
"Elegant styles. Amazing prices. Limited-time offers.": "إطلالات أنيقة، وأسعار رائعة، وعروض لفترة محدودة.",

"DRESSES": "فساتين",
"Elegant Floral Dress": "فستان أنيق بنقوش الزهور",
"A beautiful dress for casual outings and special occasions.": "فستان جميل للخروجات اليومية والمناسبات الخاصة.",

"TOPS": "بلوزات علوية",
"Classic Casual Blouse": "بلوزة كاجوال كلاسيكية",
"A versatile blouse designed for effortless everyday elegance.": "بلوزة عملية تمنحكِ أناقة يومية بسهولة.",

"JEANS": "جينز",
"High-Waist Denim Jeans": "جينز دنيم بخصر مرتفع",
"A modern fit with a timeless denim look for everyday wear.": "قصة عصرية ومظهر دنيم كلاسيكي يناسب الاستخدام اليومي.",

"SWEATERS": "بلوفرات",
"Soft Knit Sweater": "بلوفر ناعم من التريكو",
"A cozy wardrobe essential with a clean, elegant finish.": "قطعة مريحة وأساسية بتصميم أنيق وبسيط.",

"JACKETS": "جاكيتات",
"Modern Everyday Jacket": "جاكيت عصري للاستخدام اليومي",
"Complete your outfit with this stylish layering essential.": "أكملي إطلالتكِ بهذا الجاكيت الأنيق والعملي.",

"TROUSERS": "بناطيل",
"Wide-Leg Trousers": "بنطلون واسع الساقين",
"Smart, comfortable trousers for work and everyday outfits.": "بنطلون أنيق ومريح للعمل والإطلالات اليومية.",

"BLOUSES": "بلوزات",
"Elegant Satin Blouse": "بلوزة ساتان أنيقة",
"A polished piece that transitions easily from day to evening.": "قطعة أنيقة تناسب إطلالات النهار والمساء.",

"SKIRTS": "تنانير",
"Classic Midi Skirt": "تنورة ميدي كلاسيكية",
"A flattering silhouette that pairs beautifully with your favorite tops.": "تصميم أنيق يتناسق بسهولة مع بلوزاتكِ المفضلة.",

"T-SHIRTS": "تيشيرتات",
"Essential Casual T-Shirt": "تيشيرت كاجوال أساسي",
"A simple, comfortable basic for effortless daily styling.": "تيشيرت بسيط ومريح لإطلالة يومية سهلة.",

"BLAZERS": "بليزرات",
"Tailored Classic Blazer": "بليزر كلاسيكي بقصة أنيقة",
"A refined layer that adds confidence to formal and smart outfits.": "قطعة أنيقة تضيف لمسة مميزة إلى الإطلالات الرسمية والراقية.",

"Chic Summer Dress": "فستان صيفي أنيق",
"A fresh, feminine style for sunny days and weekend plans.": "إطلالة أنثوية منعشة للأيام المشمسة وعطلات نهاية الأسبوع.",

"CARDIGANS": "كارديجان",
"Lightweight Knit Cardigan": "كارديجان تريكو خفيف",
"A versatile extra layer for relaxed and sophisticated looks.": "قطعة إضافية متعددة الاستخدامات لإطلالات مريحة وأنيقة.",

"DENIM": "دنيم",
"Classic Denim Jacket": "جاكيت دنيم كلاسيكي",
"A timeless jacket that works with dresses, skirts, and jeans.": "جاكيت كلاسيكي يناسب الفساتين والتنانير والجينز.",

"FORMAL WEAR": "ملابس رسمية",
"Elegant Formal Trousers": "بنطلون رسمي أنيق",
"A tailored essential for office days and polished occasions.": "قطعة أساسية بقصة أنيقة لأيام العمل والمناسبات الرسمية.",

"OCCASION WEAR": "ملابس المناسبات",
"Elegant Evening Dress": "فستان سهرة أنيق",
"A graceful design for celebrations and memorable occasions.": "تصميم راقٍ للاحتفالات والمناسبات التي لا تُنسى.",

"SHIRTS": "قمصان",
"Relaxed Fit Shirt": "قميص بقصة مريحة",
"A clean and versatile shirt for a modern everyday wardrobe.": "قميص أنيق ومتعدد الاستخدامات لخزانة ملابس عصرية.",

"CASUAL WEAR": "ملابس كاجوال",
"Comfortable Everyday Hoodie": "هودي مريح للاستخدام اليومي",
"A relaxed essential for casual days and comfortable styling.": "قطعة مريحة لأيامكِ الكاجوال وإطلالاتكِ اليومية.",

"SHORTS": "شورتات",
"Casual Summer Shorts": "شورت صيفي كاجوال",
"A comfortable warm-weather staple for easy everyday outfits.": "قطعة صيفية مريحة لإطلالات يومية سهلة.",

"CO-ORD SETS": "أطقم متناسقة",
"Modern Matching Outfit": "طقم عصري متناسق",
"A coordinated look that makes everyday styling simple and chic.": "إطلالة متناسقة تجعل أناقتكِ اليومية سهلة وعصرية.",

"OUTERWEAR": "ملابس خارجية",
"Premium Fashion Coat": "معطف أنيق فاخر",
"A statement outerwear piece with a sophisticated finish.": "معطف مميز بلمسة نهائية راقية.",

"Elegant women's dress": "فستان نسائي أنيق",
"Women's casual blouse": "بلوزة نسائية كاجوال",
"Women's denim jeans": "جينز نسائي",
"Women's knit sweater": "بلوفر نسائي من التريكو",
"Women's stylish jacket": "جاكيت نسائي أنيق",
"Women's tailored trousers": "بنطلون نسائي بقصة أنيقة",
"Women's elegant blouse": "بلوزة نسائية أنيقة",
"Women's midi skirt": "تنورة ميدي نسائية",
"Women's casual t-shirt": "تيشيرت نسائي كاجوال",
"Women's tailored blazer": "بليزر نسائي أنيق",
"Women's summer dress": "فستان صيفي نسائي",
"Women's cardigan": "كارديجان نسائي",
"Women's denim jacket": "جاكيت دنيم نسائي",
"Women's formal trousers": "بنطلون نسائي رسمي",
"Women's long dress": "فستان نسائي طويل",
"Women's casual shirt": "قميص نسائي كاجوال",
"Women's casual hoodie": "هودي نسائي كاجوال",
"Women's casual shorts": "شورت نسائي كاجوال",
"Women's fashion outfit": "إطلالة أزياء نسائية",
"Women's premium coat": "معطف نسائي فاخر",

"Men Collection": "مجموعة الرجال",
"Women Collection": "مجموعة النساء",
"Kids Collection": "مجموعة الأطفال",
"Jeans Collection": "مجموعة الجينز",
"Shopping Cart": "سلة التسوق",
"Find Your Style": "اكتشف أسلوبك",
"Featured Products": "المنتجات المميزة",
"New Collection": "المجموعة الجديدة",
"My Account": "حسابي",
"My Cart": "سلتي",
"View Cart": "عرض السلة",
      // SPECIAL OFFERS PAGE

"THE STYLE STORE SALE": "تخفيضات STYLE STORE",
"Your Style.": "أسلوبك.",
"Better Prices.": "بأفضل الأسعار.",
"Discover exclusive deals on your favorite styles. Refresh your wardrobe and enjoy special prices across our collections.": "اكتشف عروضًا حصرية على إطلالاتك المفضلة. جدّد خزانة ملابسك واستمتع بأسعار مميزة على مجموعاتنا.",
"EXPLORE OFFERS": "اكتشف العروض",
"VIEW TOP DEALS": "شاهد أفضل العروض",
"SPECIAL PRICES. TIMELESS STYLE.": "أسعار مميزة وأناقة لا تتغير.",
"Fashion collection on sale": "مجموعة أزياء عليها تخفيضات",
"UP TO": "حتى",
"OFF": "خصم",
"NEW SEASON": "موسم جديد",
"NEW POSSIBILITIES": "إطلالات جديدة",

"Selected Styles": "إطلالات مختارة",
"Handpicked fashion deals": "عروض أزياء مختارة بعناية",
"Great Value": "قيمة رائعة",
"More style for your money": "أناقة أكثر مقابل أموالك",
"Styles for Everyone": "أناقة تناسب الجميع",
"Collections for every wardrobe": "مجموعات تناسب جميع الأذواق",

"FIND YOUR FAVORITE": "اعثر على ما تفضله",
"Shop Offers by Category": "تسوق العروض حسب القسم",
"Explore the collection that matches your style.": "اكتشف المجموعة التي تناسب أسلوبك.",

"01 / COLLECTION": "01 / المجموعة",
"02 / COLLECTION": "02 / المجموعة",
"03 / COLLECTION": "03 / المجموعة",
"04 / COLLECTION": "04 / المجموعة",

"Everyday essentials and modern looks.": "أساسيات يومية وإطلالات عصرية.",
"SHOP MEN'S OFFERS": "تسوق عروض الرجال",
"Discover elegant looks and new favorites.": "اكتشف إطلالات أنيقة واختياراتك الجديدة.",
"SHOP WOMEN'S OFFERS": "تسوق عروض النساء",
"Little looks, lovely prices.": "إطلالات صغيرة وأسعار رائعة.",
"SHOP KIDS' OFFERS": "تسوق عروض الأطفال",
"Find your fit. Own your style.": "اعثر على مقاسك وتميز بأسلوبك.",
"SHOP DENIM OFFERS": "تسوق عروض الجينز",

"DON'T MISS OUT": "لا تفوّت الفرصة",
"Featured Deals": "عروض مميزة",
"A few favorites worth a closer look.": "مجموعة من الاختيارات المميزة التي تستحق الاكتشاف.",

"Classic casual T-shirt": "تيشيرت كاجوال كلاسيكي",
"MEN'S COLLECTION": "مجموعة الرجال",
"Classic Casual T-Shirt": "تيشيرت كاجوال كلاسيكي",
"EXPLORE DEAL": "اكتشف العرض",

"WOMEN'S COLLECTION": "مجموعة النساء",
"Women's denim style": "إطلالة نسائية من الدنيم",
"Everyday Denim Style": "إطلالة دنيم يومية",

"KIDS' COLLECTION": "مجموعة الأطفال",
"Kids casual outfit": "طقم أطفال كاجوال",
"Kids Casual Essentials": "أساسيات كاجوال للأطفال",

"DENIM COLLECTION": "مجموعة الدنيم",
"Classic denim jeans": "جينز دنيم كلاسيكي",

"YOUR NEXT FAVORITE LOOK IS WAITING": "إطلالتك المفضلة التالية في انتظارك",
"Good Style. Great Deals.": "أناقة رائعة وعروض مميزة.",
"Explore all four collections and find something made for your style.": "اكتشف المجموعات الأربع واعثر على ما يناسب أسلوبك.",
"EXPLORE ALL OFFERS": "اكتشف جميع العروض",
      // LOGIN PAGE

"Back to Store": "العودة إلى المتجر",
"WELCOME TO": "مرحبًا بك في",
"Find Your Style.": "اكتشف أسلوبك.",
"Discover the latest fashion collections, exclusive offers and styles made for you.": "اكتشف أحدث مجموعات الأزياء والعروض الحصرية والإطلالات المصممة خصيصًا لك.",
"NEW COLLECTIONS & EXCLUSIVE OFFERS": "مجموعات جديدة وعروض حصرية",

"Welcome Back": "مرحبًا بعودتك",
"Login to your STYLE STORE account": "سجّل الدخول إلى حسابك في STYLE STORE",

"Email Address": "البريد الإلكتروني",
"Enter your email": "أدخل بريدك الإلكتروني",
"Password": "كلمة المرور",
"Forgot Password?": "هل نسيت كلمة المرور؟",
"Enter your password": "أدخل كلمة المرور",

"Remember me": "تذكرني",
"Login": "تسجيل الدخول",
"OR": "أو",
"Continue as Guest": "المتابعة كزائر",
"Don't have an account?": "ليس لديك حساب؟",
"Create Account": "إنشاء حساب",

"© 2026 STYLE STORE. All Rights Reserved.": "© 2026 STYLE STORE. جميع الحقوق محفوظة.",
      // PRODUCT DETAILS PAGE

"Jeans": "جينز",
"Product Details": "تفاصيل المنتج",
"Home / Jeans / Product Details": "الرئيسية / جينز / تفاصيل المنتج",

"Jeans 1": "جينز 1",
"Jeans 2": "جينز 2",
"Jeans 3": "جينز 3",
"Jeans 4": "جينز 4",
"Jeans 5": "جينز 5",

"Thumbnail 1": "صورة مصغرة 1",
"Thumbnail 2": "صورة مصغرة 2",
"Thumbnail 3": "صورة مصغرة 3",
"Thumbnail 4": "صورة مصغرة 4",
"Thumbnail 5": "صورة مصغرة 5",

"MEN JEANS": "جينز رجالي",
"Classic Slim Fit Jeans": "جينز كلاسيكي بقصة ضيقة",
"(24 Reviews)": "(24 تقييمًا)",

"Classic slim fit jeans designed for everyday comfort and a modern stylish look.": "جينز كلاسيكي بقصة ضيقة، مصمم لتوفير الراحة اليومية والمظهر العصري الأنيق.",

"Highlights": "المميزات",
"Slim Fit": "قصة ضيقة",
"Premium Denim": "دنيم فاخر",
"Comfortable Fabric": "قماش مريح",
"Everyday Style": "أناقة يومية",

"Color": "اللون",
"Black": "أسود",
"Dark Blue": "أزرق داكن",
"Light Blue": "أزرق فاتح",
"Red": "أحمر",

"Size": "المقاس",
"Size Guide": "دليل المقاسات",
"Quantity": "الكمية",

"Add to Cart": "أضف إلى السلة",
"Buy Now": "اشترِ الآن",

"Free Shipping": "شحن مجاني",
"Free delivery on orders over $50": "توصيل مجاني للطلبات التي تتجاوز 50 دولارًا",
"Easy Returns": "إرجاع سهل",
"30 days return policy": "سياسة إرجاع خلال 30 يومًا",
"Secure Payment": "دفع آمن",
"100% secure checkout": "عملية دفع آمنة 100%",

"Product Description": "وصف المنتج",
"This classic slim fit jeans combines comfort, quality and modern style. Perfect for casual everyday outfits and different occasions.": "يجمع هذا الجينز الكلاسيكي ذو القصة الضيقة بين الراحة والجودة والأناقة العصرية. يناسب الإطلالات اليومية الكاجوال والمناسبات المختلفة.",

"Specifications": "المواصفات",
"Fit:": "القصة:",
"Material:": "الخامة:",
"Style:": "الأسلوب:",
"Gender:": "الفئة:",
"Casual": "كاجوال",
"Men": "رجال",

"Size": "المقاس",
"Waist": "محيط الخصر",
"Length": "الطول",

"Materials & Care": "الخامات والعناية",
"Premium denim fabric": "قماش دنيم فاخر",
"Machine washable": "يمكن غسله في الغسالة",
"Wash with similar colors": "يُغسل مع ألوان مشابهة",
"Do not bleach": "لا تستخدم المبيض",

"Why You'll Love It": "لماذا ستحبه؟",
"A timeless design that works with shirts, T-shirts, jackets and sneakers. Comfortable enough for everyday wear while keeping a clean modern appearance.": "تصميم كلاسيكي يناسب القمصان والتيشيرتات والجاكيتات والأحذية الرياضية. مريح للاستخدام اليومي ويحافظ على مظهر عصري وأنيق.",

"Shipping & Returns": "الشحن والإرجاع",
"Orders are carefully packed and shipped safely. You can request a return according to our return policy.": "تُجهز الطلبات بعناية وتُشحن بأمان. يمكنك طلب الإرجاع وفقًا لسياسة الإرجاع الخاصة بنا.",

"Customer Reviews": "آراء العملاء",
"Great quality and very comfortable.": "جودة رائعة ومريح جدًا.",
"Nice fit and good material.": "قصة مناسبة وخامة جيدة.",

"FAQ": "الأسئلة الشائعة",
"Is the jeans true to size?": "هل مقاس الجينز مطابق للمقاس المعتاد؟",
"Yes, we recommend choosing your normal size.": "نعم، ننصحك باختيار مقاسك المعتاد.",
"Is the fabric comfortable?": "هل القماش مريح؟",
"Yes, the denim fabric is designed for everyday comfort.": "نعم، قماش الدنيم مصمم ليوفر الراحة اليومية.",

"Related Products": "منتجات ذات صلة",
"Classic Blue Jeans": "جينز أزرق كلاسيكي",
"Dark Slim Jeans": "جينز داكن بقصة ضيقة",
"Modern Fit Jeans": "جينز بقصة عصرية",
"Related Product": "منتج ذو صلة",

"Quick Links": "روابط سريعة",
"Customer Service": "خدمة العملاء",
"Contact Us": "اتصل بنا",
"Shipping": "الشحن",
"Returns": "الإرجاع",
"Modern fashion for everyone.": "أزياء عصرية تناسب الجميع.",
"© 2026 STYLE STORE. All Rights Reserved.": "© 2026 STYLE STORE. جميع الحقوق محفوظة.",
      // MEN JEANS PAGE
"Men Jeans": "جينز رجالي",
"Discover our collection of modern men's jeans": "اكتشف مجموعتنا من الجينز الرجالي العصري",

"Slim Fit Blue Jeans": "جينز أزرق بقصة ضيقة",
"Classic slim fit jeans for everyday style.": "جينز كلاسيكي بقصة ضيقة لإطلالة يومية أنيقة.",

"Straight Fit Jeans": "جينز بقصة مستقيمة",
"Comfortable straight fit with a clean look.": "جينز مريح بقصة مستقيمة ومظهر أنيق.",

"Dark Blue Jeans": "جينز أزرق داكن",
"Premium dark blue denim for a modern style.": "جينز دنيم أزرق داكن فاخر لإطلالة عصرية.",

"Classic Denim Jeans": "جينز دنيم كلاسيكي",
"Timeless denim design for every occasion.": "تصميم دنيم كلاسيكي يناسب جميع المناسبات.",

"Relaxed Fit Jeans": "جينز بقصة مريحة",
"Relaxed jeans with comfortable everyday fit.": "جينز بقصة مريحة للاستخدام اليومي.",

"Washed Blue Jeans": "جينز أزرق مغسول",
"Stylish washed denim with a modern finish.": "جينز دنيم مغسول وأنيق بلمسة عصرية.",

"Black Denim Jeans": "جينز دنيم أسود",
"Clean black denim for a sharp appearance.": "جينز دنيم أسود لإطلالة أنيقة.",

"Vintage Blue Jeans": "جينز أزرق بطابع كلاسيكي",
"Vintage-inspired denim with a unique finish.": "جينز مستوحى من الطراز الكلاسيكي بلمسة مميزة.",

"Modern Fit Jeans": "جينز بقصة عصرية",
"Modern cut designed for everyday outfits.": "قصة عصرية تناسب الإطلالات اليومية.",

"Blue Denim Classic": "جينز أزرق كلاسيكي",
"Classic blue jeans with a comfortable fit.": "جينز أزرق كلاسيكي بقصة مريحة.",

"Slim Dark Jeans": "جينز داكن بقصة ضيقة",
"Dark denim with a slim modern silhouette.": "جينز دنيم داكن بقصة ضيقة وعصرية.",

"Light Blue Jeans": "جينز أزرق فاتح",
"Light blue denim perfect for casual outfits.": "جينز دنيم أزرق فاتح يناسب الإطلالات الكاجوال.",

"Urban Denim Jeans": "جينز دنيم بطابع حضري",
"Urban style denim with a relaxed feel.": "جينز دنيم بطابع حضري وقصة مريحة.",

"Comfort Fit Jeans": "جينز بقصة مريحة",
"Comfortable denim designed for daily wear.": "جينز دنيم مريح ومناسب للارتداء اليومي.",

"Premium Blue Jeans": "جينز أزرق فاخر",
"Premium denim with a clean modern finish.": "جينز دنيم فاخر بلمسة عصرية أنيقة.",

"Everyday Denim": "جينز للاستخدام اليومي",
"Simple and comfortable jeans for daily use.": "جينز بسيط ومريح للاستخدام اليومي.",

"Deep Blue Denim": "جينز دنيم أزرق عميق",
"Deep blue denim with a premium appearance.": "جينز دنيم أزرق داكن بمظهر فاخر.",

"Street Style Jeans": "جينز بطابع ستريت",
"Modern streetwear inspired denim.": "جينز مستوحى من أزياء الشارع العصرية.",

"Classic Straight Jeans": "جينز كلاسيكي بقصة مستقيمة",
"Straight fit with a timeless denim look.": "جينز بقصة مستقيمة ومظهر كلاسيكي لا يتأثر بالموضة.",

"Premium Slim Jeans": "جينز فاخر بقصة ضيقة",
"Premium slim jeans with a stylish finish.": "جينز فاخر بقصة ضيقة ولمسة أنيقة.",

"SEARCH STORE": "ابحث في المتجر",
"Find products, collections and offers": "اعثر على المنتجات والمجموعات والعروض",
"What are you looking for?": "ما الذي تبحث عنه؟",
"SEARCH": "بحث",
"CATEGORIES": "الأقسام",

"Your destination for modern fashion, fresh collections and timeless style. Discover something made for you.": "وجهتك للأزياء العصرية والمجموعات الجديدة والأناقة الخالدة. اكتشف ما يناسبك.",
"EXPLORE STORE": "اكتشف المتجر",
"SHOP": "تسوق",
"Men Collection": "مجموعة الرجال",
"Women Collection": "مجموعة النساء",
"Kids Collection": "مجموعة الأطفال",
"Jeans Collection": "مجموعة الجينز",
"Shopping Cart": "سلة التسوق",
"DISCOVER": "اكتشف",
"Find Your Style": "اكتشف أسلوبك",
"Special Offers": "عروض خاصة",
"Featured Products": "منتجات مميزة",
"New Collection": "المجموعة الجديدة",
"MY ACCOUNT": "حسابي",
"Login": "تسجيل الدخول",
"My Account": "حسابي",
"My Cart": "سلتي",
"View Cart": "عرض السلة",
      // KIDS COLLECTION
"Discover our collection of stylish kids clothing": "اكتشف مجموعتنا من ملابس الأطفال الأنيقة",

"Kids Casual Outfit": "طقم أطفال كاجوال",
"Kids Summer Outfit": "طقم أطفال صيفي",
"Kids Fashion Set": "طقم أطفال عصري",
"Kids Denim Outfit": "طقم أطفال جينز",
"Kids Casual Shirt": "قميص أطفال كاجوال",
"Kids Stylish Dress": "فستان أطفال أنيق",
"Kids Hoodie": "هودي أطفال",
"Kids Sports Outfit": "طقم أطفال رياضي",
"Kids Blue Outfit": "طقم أطفال أزرق",
"Kids Summer Set": "طقم أطفال صيفي",
"Kids Casual Set": "طقم أطفال كاجوال",
"Kids Fashion Outfit": "إطلالة أطفال عصرية",
"Comfort Kids Set": "طقم أطفال مريح",
"Kids Trendy Set": "طقم أطفال مواكب للموضة",
"Kids Street Outfit": "إطلالة أطفال ستريت",
"Kids Elegant Outfit": "طقم أطفال أنيق",
"Kids Active Outfit": "طقم أطفال للحركة والنشاط",
"Kids Winter Outfit": "طقم أطفال شتوي",
"Kids Daily Outfit": "طقم أطفال يومي",
"Kids Premium Outfit": "طقم أطفال فاخر",

"Comfortable and stylish outfit for everyday wear.": "طقم مريح وأنيق للاستخدام اليومي.",
"Light and comfortable clothes for summer days.": "ملابس خفيفة ومريحة لأيام الصيف.",
"Modern kids set with a fun and stylish design.": "طقم أطفال عصري بتصميم مرح وأنيق.",
"Cool denim outfit designed for active kids.": "طقم جينز عصري مناسب للأطفال كثيري الحركة.",
"Simple casual shirt with a comfortable fit.": "قميص كاجوال بسيط ومريح.",
"Beautiful and comfortable dress for kids.": "فستان جميل ومريح للأطفال.",
"Warm and comfortable hoodie for cooler days.": "هودي دافئ ومريح للأيام الباردة.",
"Comfortable sportswear for active kids.": "ملابس رياضية مريحة للأطفال النشيطين.",
"Fresh blue outfit with a modern kids style.": "طقم أزرق منعش بأسلوب عصري للأطفال.",
"Easy and comfortable summer clothing set.": "طقم صيفي مريح وسهل الارتداء.",
"Everyday casual set made for comfort.": "طقم كاجوال يومي مصمم للراحة.",
"Trendy outfit with a modern fashion look.": "إطلالة عصرية تواكب الموضة.",
"Soft and comfortable clothes for daily activities.": "ملابس ناعمة ومريحة للأنشطة اليومية.",
"Fun and trendy clothing for stylish kids.": "ملابس مرحة وعصرية للأطفال الأنيقين.",
"Modern street style outfit for kids.": "إطلالة ستريت عصرية للأطفال.",
"Elegant and comfortable outfit for special days.": "طقم أنيق ومريح للمناسبات المميزة.",
"Flexible clothes made for active children.": "ملابس مرنة مناسبة للأطفال كثيري الحركة.",
"Warm winter outfit with a comfortable design.": "طقم شتوي دافئ بتصميم مريح.",
"Simple everyday outfit for maximum comfort.": "طقم يومي بسيط لراحة أكبر.",
"Premium kids clothing with a stylish finish.": "ملابس أطفال فاخرة بلمسة أنيقة.",

"Add To Cart": "أضف إلى السلة",
   // WOMEN COLLECTION
"Discover our collection of stylish women's clothing": "اكتشفي مجموعتنا من الملابس النسائية الأنيقة",
"All": "الكل",
"Shirts": "قمصان",
"T-shirts": "تيشيرتات",
"Sweatshirts": "سويت شيرت",
"Jackets": "جاكيتات",
"Blazers": "بليزرات",
"Outfits": "أطقم",
"PRICE (EGP)": "السعر (جنيه)",
"Min": "من",
"Max": "إلى",
"to": "إلى",
"COLORS": "الألوان",
"Black": "أسود",
"White": "أبيض",
"Navy": "كحلي",
"Olive": "زيتي",
"Beige": "بيج",
"SORT BY": "ترتيب حسب",
"Newest": "الأحدث",
"Price: low to high": "السعر: من الأقل للأعلى",
"Price: high to low": "السعر: من الأعلى للأقل",

// WOMEN PRODUCTS
"Women's Casual Outfit": "طقم نسائي كاجوال",
"Comfortable and stylish outfit for everyday wear.": "طقم مريح وأنيق للاستخدام اليومي.",
"Elegant Women's Dress": "فستان نسائي أنيق",
"Elegant dress with a modern and beautiful design.": "فستان أنيق بتصميم عصري وجميل.",
"Women's Denim Jacket": "جاكيت جينز نسائي",
"Modern denim jacket perfect for casual outfits.": "جاكيت جينز عصري مناسب للإطلالات الكاجوال.",
"Women's Summer Dress": "فستان صيفي نسائي",
"Light and comfortable dress for summer days.": "فستان خفيف ومريح لأيام الصيف.",
"Women's Fashion Outfit": "طقم نسائي عصري",
"Modern fashion outfit with a stylish appearance.": "طقم عصري بمظهر أنيق.",
"Women's Casual Dress": "فستان كاجوال نسائي",
"Simple and comfortable dress for everyday use.": "فستان بسيط ومريح للاستخدام اليومي.",
"Women's Modern Outfit": "إطلالة نسائية عصرية",
"Modern outfit designed for a stylish everyday look.": "إطلالة عصرية وأنيقة للاستخدام اليومي.",
"Women's Elegant Outfit": "طقم نسائي أنيق",
"Elegant outfit suitable for special occasions.": "طقم أنيق مناسب للمناسبات الخاصة.",
"Women's Blouse": "بلوزة نسائية",
"Elegant blouse with a clean modern design.": "بلوزة أنيقة بتصميم عصري بسيط.",
"Women's Evening Dress": "فستان سهرة نسائي",
"Beautiful evening dress with an elegant style.": "فستان سهرة جميل وأنيق.",
"Women's Street Outfit": "إطلالة نسائية ستريت",
"Trendy streetwear outfit for a modern look.": "إطلالة ستريت عصرية ومواكبة للموضة.",
"Women's Shopping Outfit": "طقم نسائي للتسوق",
"Comfortable outfit perfect for everyday activities.": "طقم مريح مناسب للأنشطة اليومية.",
"Women's Premium Outfit": "طقم نسائي فاخر",
"Premium clothing with a sophisticated finish.": "ملابس فاخرة بلمسة راقية.",
"Women's Light Dress": "فستان نسائي خفيف",
"Light and comfortable dress with a simple design.": "فستان خفيف ومريح بتصميم بسيط.",
"Women's Urban Outfit": "إطلالة نسائية حضرية",
"Urban-inspired outfit with a modern look.": "إطلالة مستوحاة من الأزياء الحضرية بمظهر عصري.",
"Women's Party Outfit": "طقم نسائي للحفلات",
"Stylish outfit designed for special occasions.": "طقم أنيق مصمم للمناسبات الخاصة.",
"Women's Classic Blouse": "بلوزة نسائية كلاسيكية",
"Classic blouse suitable for different occasions.": "بلوزة كلاسيكية مناسبة لمناسبات مختلفة.",
"Women's Long Dress": "فستان نسائي طويل",
"Elegant long dress with a beautiful silhouette.": "فستان طويل أنيق بقصة جميلة.",
"Women's Daily Outfit": "طقم نسائي يومي",
"Comfortable daily outfit with a modern style.": "طقم يومي مريح بأسلوب عصري.",
"Women's Premium Collection": "تشكيلة نسائية فاخرة",
"Premium women's clothing with an elegant finish.": "ملابس نسائية فاخرة بلمسة أنيقة.",

// WOMEN IMAGE ALT TEXT
"Women's Casual Outfit": "طقم نسائي كاجوال",
"Elegant Women's Dress": "فستان نسائي أنيق",
"Women's Denim Jacket": "جاكيت جينز نسائي",
"Women's Summer Dress": "فستان صيفي نسائي",
"Women's Fashion Outfit": "طقم نسائي عصري",
"Women's Casual Dress": "فستان كاجوال نسائي",
"Women's Modern Outfit": "إطلالة نسائية عصرية",
"Women's Elegant Outfit": "طقم نسائي أنيق",
"Women's Blouse": "بلوزة نسائية",
"Women's Evening Dress": "فستان سهرة نسائي",
"Women's Street Outfit": "إطلالة نسائية ستريت",
"Women's Shopping Outfit": "طقم نسائي للتسوق",
"Women's Premium Outfit": "طقم نسائي فاخر",
"Women's Light Dress": "فستان نسائي خفيف",
"Women's Urban Outfit": "إطلالة نسائية حضرية",
"Women's Party Outfit": "طقم نسائي للحفلات",
"Women's Classic Blouse": "بلوزة نسائية كلاسيكية",
"Women's Long Dress": "فستان نسائي طويل",
"Women's Daily Outfit": "طقم نسائي يومي",
"Women's Premium Collection": "تشكيلة نسائية فاخرة",
        // GENERAL NAVIGATION
        "Open navigation menu": "فتح قائمة التنقل",
        "Close navigation menu": "إغلاق قائمة التنقل",
        "Choose language": "اختر اللغة",
        "Search": "بحث",
        "SEARCH": "بحث",
        "SEARCH STORE": "البحث في المتجر",
        "Find products, collections and offers": "ابحث عن المنتجات والمجموعات والعروض",
        "What are you looking for?": "عن ماذا تبحث؟",
        "Search the store": "ابحث في المتجر",
        "POPULAR": "الأكثر بحثًا",
        "Home": "الرئيسية",
        "Men": "رجالي",
        "Women": "حريمي",
        "Kids": "أطفال",
        "Jeans": "جينز",
        "Cart 🛒": "السلة 🛒",
        "Cart": "السلة",
        "Login": "تسجيل الدخول",
        "Wishlist": "المفضلة",

        // HOME PAGE
        "YOUR STYLE. YOUR WORLD.": "أسلوبك. عالمك.",
        "DISCOVER YOUR STYLE": "اكتشف أسلوبك",
        "Explore": "اكتشف",
        "the collection.": "المجموعة.",
        "Discover fashion, new arrivals and": "اكتشف أحدث صيحات الموضة والمنتجات الجديدة",
        "everything you need in one place.": "وكل ما تحتاجه في مكان واحد.",
        "MAIN NAVIGATION": "القائمة الرئيسية",
        "Back to the homepage": "العودة إلى الصفحة الرئيسية",
        "Shop All Products": "تسوق جميع المنتجات",
        "Browse all categories": "تصفح جميع الأقسام",
        "New Arrivals": "وصل حديثًا",
        "Discover the latest styles": "اكتشف أحدث التصميمات",
        "Featured Products": "المنتجات المميزة",
        "Explore our featured picks": "اكتشف اختياراتنا المميزة",
        "SHOP BY CATEGORY": "تسوق حسب القسم",
        "SPECIAL OFFERS": "عروض خاصة",
        "All Special Offers": "جميع العروض الخاصة",
        "Explore available promotions": "اكتشف العروض المتاحة",
        "Men's Offers": "عروض الرجال",
        "Women's Offers": "عروض النساء",
        "Kids' Offers": "عروض الأطفال",
        "Jeans Offers": "عروض الجينز",
        "YOUR SHOPPING": "تسوقك",
        "Your saved favourites": "المنتجات المحفوظة في المفضلة",
        "Shopping Cart": "سلة التسوق",
        "View your shopping bag": "عرض سلة التسوق",
        "Checkout": "إتمام الطلب",
        "Continue to checkout": "متابعة إتمام الطلب",
        "My Account / Login": "حسابي / تسجيل الدخول",
        "Access your account": "الدخول إلى حسابك",
        "Product Details": "تفاصيل المنتج",
        "Explore product information": "اكتشف تفاصيل المنتج",
        "HELP & INFORMATION": "المساعدة والمعلومات",
        "Shipping & Delivery": "الشحن والتوصيل",
        "Returns & Exchange": "الإرجاع والاستبدال",
        "Secure Payment": "الدفع الآمن",
        "Customer Support": "خدمة العملاء",
        "About the Store": "عن المتجر",
        "Contact & Store Information": "التواصل ومعلومات المتجر",
        "DISCOVER MORE": "اكتشف المزيد",
        "Featured Offers": "العروض المميزة",
        "Limited-Time Promotions": "عروض لفترة محدودة",
        "All Shop Services": "جميع خدمات المتجر",
        "Go to Website Footer": "الانتقال إلى نهاية الموقع",
        "Need Help?": "هل تحتاج إلى مساعدة؟",
        "Visit our customer support section": "تفضل بزيارة قسم خدمة العملاء",
        "FASHION · STYLE · QUALITY": "الموضة · الأناقة · الجودة",
        "CHOOSE LANGUAGE": "اختر اللغة",
        "Select your preferred language": "اختر لغتك المفضلة",
        "English language": "اللغة الإنجليزية",
        "NEW COLLECTION": "مجموعة جديدة",
        "FIND YOUR STYLE": "اكتشف أسلوبك",
        "Discover our latest fashion collection.": "اكتشف أحدث مجموعات الأزياء لدينا.",
        "SHOP NOW": "تسوق الآن",
        "Find Your Style": "اكتشف أسلوبك",
        "FEATURED OFFERS": "العروض المميزة",
        "Special Offers": "عروض خاصة",
        "UP TO 30% OFF": "خصم يصل إلى 30٪",
        "UP TO 40% OFF": "خصم يصل إلى 40٪",
        "UP TO 25% OFF": "خصم يصل إلى 25٪",
        "UP TO 35% OFF": "خصم يصل إلى 35٪",
        "Discover special offers for men.": "اكتشف العروض الخاصة بالرجال.",
        "Discover special offers for women.": "اكتشف العروض الخاصة بالنساء.",
        "Discover special offers for kids.": "اكتشف العروض الخاصة بالأطفال.",
        "Discover special offers on jeans.": "اكتشف العروض الخاصة بالجينز.",
        "Our Featured Picks": "اختياراتنا المميزة",
        "Explore our featured jeans collection.": "اكتشف مجموعتنا المميزة من الجينز.",
        "Explore our featured kids collection.": "اكتشف مجموعتنا المميزة للأطفال.",
        "Explore our featured women collection.": "اكتشف مجموعتنا المميزة للنساء.",
        "Explore our featured men collection.": "اكتشف مجموعتنا المميزة للرجال.",
        "LIMITED TIME OFFER": "عرض لفترة محدودة",
        "UP TO 50% OFF": "خصم يصل إلى 50٪",
        "Discover our special collection and enjoy exclusive offers.": "اكتشف مجموعتنا الخاصة واستمتع بعروض حصرية.",
        "SHOP OFFERS": "تسوق العروض",
        "Discover our latest styles and fresh arrivals.": "اكتشف أحدث التصميمات والمنتجات الجديدة.",
        "NEW": "جديد",
        "DISCOVER THE LOOK": "اكتشف الإطلالة",
        "ESSENTIALS": "أساسيات",
        "Classic T-Shirt": "تيشيرت كلاسيكي",
        "DENIM EDITION": "مجموعة الدنيم",
        "Modern Jeans": "جينز عصري",
        "COMFORT WEAR": "ملابس مريحة",
        "Casual Hoodie": "هودي كاجوال",
        "OUTERWEAR": "ملابس خارجية",
        "Streetwear Jacket": "جاكيت ستريت وير",
        "SOFT KNITS": "ملابس تريكو ناعمة",
        "Knit Sweater": "بلوفر تريكو",
        "SMART CASUAL": "كاجوال أنيق",
        "Classic Polo Shirt": "تيشيرت بولو كلاسيكي",
        "Denim Jacket": "جاكيت جينز",
        "FINISHING TOUCH": "اللمسة الأخيرة",
        "Classic Sneakers": "حذاء رياضي كلاسيكي",
        "EXPLORE THE COLLECTION": "اكتشف المجموعة",

        // MEN PAGE — FILTERS
        "Men Collection": "مجموعة الرجال",
        "Discover our collection of stylish men's clothing": "اكتشف مجموعتنا من الملابس الرجالية الأنيقة",
        "All": "الكل",
        "Shirts": "قمصان",
        "T-shirts": "تيشيرتات",
        "Sweatshirts": "سويت شيرت",
        "Jackets": "جاكيتات",
        "Blazers": "بليزرات",
        "Outfits": "أطقم ملابس",
        "PRICE (EGP)": "السعر (جنيه مصري)",
        "COLORS": "الألوان",
        "SORT BY": "ترتيب حسب",
        "Min": "الحد الأدنى",
        "Max": "الحد الأقصى",
        "to": "إلى",
        "Black": "أسود",
        "White": "أبيض",
        "Navy": "كحلي",
        "Olive": "زيتي",
        "Beige": "بيج",
        "Newest": "الأحدث",
        "Price: low to high": "السعر: من الأقل للأعلى",
        "Price: high to low": "السعر: من الأعلى للأقل",
        "Minimum price": "السعر الأدنى",
        "Maximum price": "السعر الأعلى",

        // MEN PAGE — PRODUCTS
        "Men Casual Outfit": "طقم رجالي كاجوال",
        "Men Formal Shirt": "قميص رجالي رسمي",
        "Men Casual Shirt": "قميص رجالي كاجوال",
        "Men Leather Jacket": "جاكيت جلد رجالي",
        "Men Polo Shirt": "تيشيرت بولو رجالي",
        "Men Casual Jacket": "جاكيت رجالي كاجوال",
        "Men Classic Blazer": "بليزر رجالي كلاسيكي",
        "Men Street Outfit": "طقم رجالي ستريت ستايل",
        "Men Oversized T-Shirt": "تيشيرت رجالي أوفر سايز",
        "Men Premium T-Shirt": "تيشيرت رجالي فاخر",
        "Men Bomber Jacket": "جاكيت بومبر رجالي",
        "Men Linen Shirt": "قميص كتان رجالي",
        "Men Classic Outfit": "طقم رجالي كلاسيكي",
        "Men Sweatshirt": "سويت شيرت رجالي",
        "Men Check Shirt": "قميص رجالي كاروهات",
        "Men Formal Blazer": "بليزر رجالي رسمي",
        "Men Urban Outfit": "طقم رجالي بطابع عصري",
        "Men Winter Jacket": "جاكيت شتوي رجالي",
        "Men Summer Shirt": "قميص صيفي رجالي",
        "Men Premium Collection": "المجموعة الرجالية الفاخرة",

        "Comfortable and stylish outfit for everyday wear.": "طقم مريح وأنيق للاستخدام اليومي.",
        "Clean and elegant shirt for a smart appearance.": "قميص أنيق بتصميم بسيط لإطلالة راقية.",
        "Modern casual shirt with a comfortable fit.": "قميص كاجوال عصري بقصة مريحة.",
        "Stylish jacket with a modern masculine design.": "جاكيت أنيق بتصميم رجالي عصري.",
        "Classic polo shirt suitable for everyday outfits.": "تيشيرت بولو كلاسيكي مناسب للإطلالات اليومية.",
        "Modern casual jacket with a clean design.": "جاكيت كاجوال عصري بتصميم بسيط.",
        "Elegant blazer for formal and special occasions.": "بليزر أنيق للمناسبات الرسمية والخاصة.",
        "Modern streetwear outfit with a relaxed style.": "طقم ستريت وير عصري بإطلالة مريحة.",
        "Comfortable oversized t-shirt for casual looks.": "تيشيرت أوفر سايز مريح للإطلالات الكاجوال.",
        "Premium basic t-shirt with a clean finish.": "تيشيرت أساسي فاخر بتشطيب أنيق.",
        "Modern bomber jacket for a stylish casual look.": "جاكيت بومبر عصري لإطلالة كاجوال أنيقة.",
        "Lightweight linen shirt for a fresh summer look.": "قميص كتان خفيف لإطلالة صيفية منعشة.",
        "Classic outfit designed for a clean appearance.": "طقم كلاسيكي مصمم لإطلالة أنيقة.",
        "Comfortable sweatshirt for cooler days.": "سويت شيرت مريح للأيام الباردة.",
        "Casual checked shirt for everyday styling.": "قميص كاروهات كاجوال للإطلالات اليومية.",
        "Elegant blazer for formal occasions.": "بليزر أنيق للمناسبات الرسمية.",
        "Urban-inspired outfit with a modern appearance.": "طقم مستوحى من الأزياء الحضرية بإطلالة عصرية.",
        "Warm jacket with a modern winter design.": "جاكيت دافئ بتصميم شتوي عصري.",
        "Lightweight shirt perfect for summer days.": "قميص خفيف مناسب لأيام الصيف.",
        "Premium men's clothing with a sophisticated finish.": "ملابس رجالية فاخرة بلمسات راقية.",

        // PRODUCT ACTIONS
        "View Product": "عرض المنتج",
        "Add to Cart": "أضف إلى السلة",
        "Add to wishlist": "أضف إلى المفضلة",

        // SERVICES
        "SHOP WITH CONFIDENCE": "تسوق بكل ثقة",
        "Everything You Need, All in One Place": "كل ما تحتاجه في مكان واحد",
        "We make your shopping experience simple, safe, and convenient.": "نجعل تجربة التسوق سهلة وآمنة ومريحة.",
        "Fast & Reliable Shipping": "شحن سريع وموثوق",
        "Get your order delivered quickly and safely right to your door.": "استلم طلبك بسرعة وأمان حتى باب منزلك.",
        "Easy Returns & Exchange": "إرجاع واستبدال بسهولة",
        "Not satisfied with your order? Enjoy an easy and simple return or exchange process.": "غير راضٍ عن طلبك؟ يمكنك إرجاعه أو استبداله بسهولة.",
        "Your payment information is protected with safe and secure checkout.": "نحافظ على أمان معلومات الدفع أثناء إتمام الطلب.",
        "Our support team is ready to help you whenever you need us.": "فريق الدعم جاهز لمساعدتك في أي وقت.",

        // FOOTER
        "Your destination for modern fashion,": "وجهتك للأزياء العصرية،",
        "fresh collections and timeless style.": "والمجموعات الجديدة والأناقة الخالدة.",
        "Discover something made for you.": "اكتشف ما صُمم خصيصًا لك.",
        "EXPLORE STORE": "اكتشف المتجر",
        "SHOP": "تسوق",
        "Women Collection": "مجموعة النساء",
        "Kids Collection": "مجموعة الأطفال",
        "Jeans Collection": "مجموعة الجينز",
        "DISCOVER": "اكتشف",
        "MY ACCOUNT": "حسابي",
        "My Account": "حسابي",
        "My Cart": "سلتي",
        "View Cart": "عرض السلة"
    };

    const originalText = new WeakMap();
    const originalAttributes = new WeakMap();

    function translatePage(language) {
        const isArabic = language === "ar";

        document.documentElement.lang = isArabic ? "ar" : "en";

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT
        );

        let node;

        while ((node = walker.nextNode())) {
            const parent = node.parentElement;

            if (!parent || parent.closest("script, style, noscript")) {
                continue;
            }

            if (!originalText.has(node)) {
                originalText.set(node, node.nodeValue);
            }

            const original = originalText.get(node);
            const trimmed = original.trim();

            if (!trimmed) continue;

            const leading = original.match(/^\s*/)[0];
            const trailing = original.match(/\s*$/)[0];

            const translated = isArabic
                ? (translations[trimmed] || trimmed)
                : trimmed;

            node.nodeValue = leading + translated + trailing;
        }

        const attributes = [
            "placeholder",
            "aria-label",
            "title",
            "alt"
        ];

        document.querySelectorAll("*").forEach(function (element) {
            attributes.forEach(function (attribute) {
                if (!element.hasAttribute(attribute)) return;

                let saved = originalAttributes.get(element);

                if (!saved) {
                    saved = {};
                    originalAttributes.set(element, saved);
                }

                if (saved[attribute] === undefined) {
                    saved[attribute] = element.getAttribute(attribute);
                }

                const original = saved[attribute];

                element.setAttribute(
                    attribute,
                    isArabic
                        ? (translations[original] || original)
                        : original
                );
            });
        });

        if (languageCode) {
            languageCode.textContent = isArabic ? "AR" : "EN";
        }

        if (languageName) {
            languageName.textContent = isArabic ? "العربية" : "English";
        }

        languageButtons.forEach(function (button) {
            const active = button.dataset.language === language;

            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        if (languageDropdown) {
            languageDropdown.open = false;
        }

        try {
            localStorage.setItem("style-store-language", language);
        } catch (error) {
            // Language switching still works without localStorage.
        }
    }

    languageButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            translatePage(button.dataset.language);
        });
    });

    let savedLanguage = "en";

    try {
        savedLanguage =
            localStorage.getItem("style-store-language") || "en";
    } catch (error) {
        savedLanguage = "en";
    }

    translatePage(savedLanguage);
});
// ============================================
// نهاية الجزء الخاص بترجمة الموقع بالكامل
// END OF WEBSITE FULL TRANSLATION SECTION
// ============================================
































































/* =========================================
   STYLE STORE — COMPLETE SEARCH SYSTEM
   نظام البحث في الموقع بالكامل
========================================= */

const storeSearchPages = [
    {
        name: "Men",
        keywords: ["men", "man", "رجال", "رجالي", "ملابس رجالي"],
        url: "men.html"
    },
    {
        name: "Women",
        keywords: ["women", "woman", "حريمي", "نسائي", "نساء", "ملابس حريمي"],
        url: "women.html"
    },
    {
        name: "Kids",
        keywords: ["kids", "children", "أطفال", "اطفال", "ملابس أطفال"],
        url: "kids.html"
    },
    {
        name: "Jeans",
        keywords: ["jeans", "جينز", "دنيم"],
        url: "men-jeans.html"
    },
    {
        name: "Men Offers",
        keywords: ["men offers", "men special offers", "عروض رجالي", "عروض الرجال"],
        url: "men-offers.html"
    },
    {
        name: "Women Offers",
        keywords: ["women offers", "women special offers", "عروض حريمي", "عروض النساء"],
        url: "women-offers.html"
    },
    {
        name: "Kids Offers",
        keywords: ["kids offers", "children offers", "عروض أطفال", "عروض اطفال"],
        url: "kids-offers.html"
    },
    {
        name: "Jeans Offers",
        keywords: ["jeans offers", "denim offers", "عروض جينز", "عروض الدنيم"],
        url: "jeans-offers.html"
    },
    {
        name: "Cart",
        keywords: ["cart", "shopping cart", "سلة", "السلة", "سلة التسوق"],
        url: "cart.html"
    },
    {
        name: "Checkout",
        keywords: ["checkout", "place order", "الدفع", "إتمام الطلب", "اكمال الطلب"],
        url: "checkout.html"
    },
    {
        name: "Login",
        keywords: ["login", "sign in", "تسجيل الدخول", "دخول"],
        url: "login.html"
    },
    {
        name: "Wishlist",
        keywords: ["wishlist", "favorites", "المفضلة", "قائمة المفضلة"],
        url: "wishlist.html"
    }
];

/*
   PRODUCT INDEX
   أضف المنتجات الفعلية هنا مع رابط كل منتج.
   لا تضف بيانات أو خصومات غير موجودة في الموقع.
*/
const storeSearchProducts = [
    // مثال:
    // {
    //     name: "Classic T-Shirt",
    //     keywords: ["تيشيرت كلاسيكي", "تيشيرت رجالي", "classic t-shirt"],
    //     category: "men",
    //     url: "product.html?id=classic-t-shirt",
    //     price: 500,
    //     discount: 5
    // }
];

function normalizeSearchText(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[أإآ]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/[ًٌٍَُِّْـ]/g, "")
        .replace(/\s+/g, " ");
}

function searchStore(searchValue) {
    const query = normalizeSearchText(searchValue);

    if (query === "") {
        alert("اكتب اسم المنتج أو القسم الذي تبحث عنه.");
        return;
    }

    // 1. ابحث عن المنتجات المسجلة في الفهرس
    const productResults = storeSearchProducts.filter(function (product) {
        const searchableText = normalizeSearchText(
            product.name + " " +
            (product.keywords || []).join(" ") + " " +
            (product.category || "") + " " +
            (product.price || "") + " " +
            (product.discount || "")
        );

        return searchableText.includes(query);
    });

    if (productResults.length === 1) {
        window.location.href = productResults[0].url;
        return;
    }

    if (productResults.length > 1) {
        sessionStorage.setItem(
            "style-store-search-query",
            searchValue.trim()
        );

        sessionStorage.setItem(
            "style-store-search-results",
            JSON.stringify(productResults)
        );

        window.location.href =
            "search-results.html?q=" + encodeURIComponent(searchValue.trim());
        return;
    }

    // 2. ابحث عن القسم أو صفحة العروض
    const pageResult = storeSearchPages.find(function (page) {
        return page.keywords.some(function (keyword) {
            const normalizedKeyword = normalizeSearchText(keyword);

            return normalizedKeyword === query ||
                normalizedKeyword.includes(query) ||
                query.includes(normalizedKeyword);
        });
    });

    if (pageResult) {
        window.location.href = pageResult.url;
        return;
    }

    // 3. لم توجد نتيجة
    alert("لم نجد نتيجة مطابقة. جرّب اسمًا آخر أو اسم القسم.");
}

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const searchButton = document.querySelector(".search-submit");

    if (!searchInput || !searchButton) {
        return;
    }

    searchButton.addEventListener("click", function () {
        searchStore(searchInput.value);
    });

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchStore(searchInput.value);
        }
    });
});

/* =========================================
   END OF STYLE STORE SEARCH SYSTEM
   نهاية كود البحث
========================================= */

























































/* =========================================
   STYLE STORE — LOGIN SYSTEM
   التحقق من نموذج تسجيل الدخول
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // تشغيل الكود في صفحة تسجيل الدخول فقط
    const loginPage = document.querySelector(".login-page");

    if (!loginPage) {
        return;
    }

    const loginForm = loginPage.querySelector(".login-box form");

    if (!loginForm) {
        return;
    }

    const emailInput = loginForm.querySelector('input[type="email"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');
    const rememberCheckbox = loginForm.querySelector("#remember");
    const loginButton = loginForm.querySelector(".login-submit");
    const forgotPasswordLink = loginForm.querySelector(".password-title a");
    const guestButton = loginForm.querySelector(".guest-button");
    const createAccountLink = loginPage.querySelector(".login-footer a");

    if (!emailInput || !passwordInput || !loginButton) {
        return;
    }

    // الحقول مطلوبة
    emailInput.required = true;
    passwordInput.required = true;

    emailInput.autocomplete = "email";
    passwordInput.autocomplete = "current-password";

    // =========================================
    // 1. إنشاء مكان لرسائل التحقق
    // =========================================

    const messageBox = document.createElement("div");

    messageBox.className = "login-message";
    messageBox.setAttribute("role", "status");
    messageBox.setAttribute("aria-live", "polite");

    messageBox.style.display = "none";
    messageBox.style.marginTop = "15px";
    messageBox.style.padding = "12px";
    messageBox.style.borderRadius = "8px";
    messageBox.style.fontSize = "14px";
    messageBox.style.lineHeight = "1.6";

    loginForm.insertBefore(messageBox, loginButton);

    function showMessage(message, type) {

        messageBox.textContent = message;
        messageBox.style.display = "block";

        if (type === "error") {
            messageBox.style.backgroundColor = "#fff0f0";
            messageBox.style.color = "#b42318";
            messageBox.style.border = "1px solid #f5c2c0";
        } else {
            messageBox.style.backgroundColor = "#f0f8f1";
            messageBox.style.color = "#246b35";
            messageBox.style.border = "1px solid #c5e5cb";
        }
    }

    function clearMessage() {
        messageBox.textContent = "";
        messageBox.style.display = "none";
    }

    // =========================================
    // 2. استعادة البريد المحفوظ
    // =========================================

    try {

        const savedEmail = localStorage.getItem("styleStoreRememberedEmail");

        if (savedEmail) {
            emailInput.value = savedEmail;

            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }

    } catch (error) {
        console.warn("Could not access saved email.", error);
    }

    // =========================================
    // 3. إظهار وإخفاء كلمة المرور
    // =========================================

    const passwordWrapper = passwordInput.parentElement;

    const togglePassword = document.createElement("button");

    togglePassword.type = "button";
    togglePassword.textContent = "Show";
    togglePassword.className = "login-password-toggle";

    togglePassword.style.marginTop = "8px";
    togglePassword.style.padding = "5px 10px";
    togglePassword.style.border = "1px solid #c8a96b";
    togglePassword.style.borderRadius = "5px";
    togglePassword.style.backgroundColor = "#ffffff";
    togglePassword.style.color = "#795c2b";
    togglePassword.style.cursor = "pointer";

    togglePassword.setAttribute("aria-label", "Show password");

    passwordWrapper.appendChild(togglePassword);

    togglePassword.addEventListener("click", function () {

        const passwordIsHidden = passwordInput.type === "password";

        passwordInput.type = passwordIsHidden ? "text" : "password";

        togglePassword.textContent = passwordIsHidden ? "Hide" : "Show";

        togglePassword.setAttribute(
            "aria-label",
            passwordIsHidden ? "Hide password" : "Show password"
        );

    });

    // =========================================
    // 4. التحقق من البيانات عند تسجيل الدخول
    // =========================================

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        clearMessage();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // التأكد من إدخال البريد الإلكتروني
        if (email === "") {
            showMessage("Please enter your email address.", "error");
            emailInput.focus();
            return;
        }

        // التحقق من صيغة البريد الإلكتروني
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showMessage("Please enter a valid email address.", "error");
            emailInput.focus();
            return;
        }

        // التأكد من إدخال كلمة المرور
        if (password.trim() === "") {
            showMessage("Please enter your password.", "error");
            passwordInput.focus();
            return;
        }

        // حفظ البريد فقط إذا اختار المستخدم Remember me
        try {

            if (rememberCheckbox && rememberCheckbox.checked) {

                localStorage.setItem(
                    "styleStoreRememberedEmail",
                    email
                );

            } else {

                localStorage.removeItem("styleStoreRememberedEmail");

            }

        } catch (error) {
            console.warn("Could not save the remembered email.", error);
        }

        // لا يوجد خادم مصادقة حقيقي متصل حتى الآن
        showMessage(
            "Your information format is valid, but real account authentication is not connected yet.",
            "success"
        );

    });

    // =========================================
    // 5. مسح رسالة الخطأ عند تعديل الحقول
    // =========================================

    emailInput.addEventListener("input", clearMessage);
    passwordInput.addEventListener("input", clearMessage);

    // =========================================
    // 6. Continue as Guest
    // =========================================

    if (guestButton) {

        guestButton.href = "index.html";

        guestButton.addEventListener("click", function (event) {

            // السماح بالانتقال الطبيعي إلى المتجر
            clearMessage();

        });

    }

   

   

/* ========================================
   REGISTER PAGE - FORM VALIDATION
======================================== */

(function () {
    const registerForm = document.getElementById("register-form");

    // Run this code only on the registration page
    if (!registerForm) {
        return;
    }

    const nameInput = document.getElementById("register-name");
    const emailInput = document.getElementById("register-email");
    const passwordInput = document.getElementById("register-password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const termsCheckbox = document.getElementById("register-terms");

    // Create a message area if it doesn't exist
    let registerMessage = document.getElementById("register-message");

    if (!registerMessage) {
        registerMessage = document.createElement("p");
        registerMessage.id = "register-message";
        registerMessage.setAttribute("role", "status");
        registerMessage.setAttribute("aria-live", "polite");

        registerForm.appendChild(registerMessage);
    }

    function showRegisterMessage(message, isSuccess) {
        registerMessage.textContent = message;
        registerMessage.style.color = isSuccess ? "#287a45" : "#c0392b";
        registerMessage.style.fontSize = "14px";
        registerMessage.style.lineHeight = "1.7";
        registerMessage.style.marginTop = "15px";
    }

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // 1. Check the name
        if (name.length < 2) {
            showRegisterMessage(
                "Please enter your name (at least 2 characters).",
                false
            );
            nameInput.focus();
            return;
        }

        // 2. Check the email
        if (!emailInput.validity.valid || email === "") {
            showRegisterMessage(
                "Please enter a valid email address.",
                false
            );
            emailInput.focus();
            return;
        }

        // 3. Check the password length
        if (password.length < 8) {
            showRegisterMessage(
                "Your password must contain at least 8 characters.",
                false
            );
            passwordInput.focus();
            return;
        }

        // 4. Confirm the password
        if (password !== confirmPassword) {
            showRegisterMessage(
                "Passwords do not match. Please try again.",
                false
            );
            confirmPasswordInput.focus();
            return;
        }

        // 5. Check agreement to the terms
        if (!termsCheckbox.checked) {
            showRegisterMessage(
                "Please agree to the terms before continuing.",
                false
            );
            termsCheckbox.focus();
            return;
        }

        // 6. Front-end validation completed
        showRegisterMessage(
            "Your information passed the front-end checks. Real account registration is not connected yet.",
            true
        );

        registerForm.reset();
    });
})();

})

































































































/* =========================================
   STYLE STORE - MEN FILTERS
   Price + Colors + Categories + Sorting
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const menPage = document.querySelector(".men-page");

    // تشغيل الفلتر في صفحة الرجال فقط
    if (!menPage) return;

    const productsContainer =
        menPage.querySelector(".men-products");

    const minInput = menPage.querySelector("#price-min");
    const maxInput = menPage.querySelector("#price-max");
    const sortSelect = menPage.querySelector("#sort-by");

    const categoryButtons = menPage.querySelectorAll(
        ".filter-pill[data-filter]"
    );

    const colorButtons = menPage.querySelectorAll(
        ".filter-color[data-color]"
    );

    if (!productsContainer || !minInput ||
        !maxInput || !sortSelect) {
        console.error("Men filters: HTML elements not found.");
        return;
    }

    const products = Array.from(
        productsContainer.querySelectorAll(".men-card")
    );

    if (products.length === 0) {
        console.error("Men filters: No products found.");
        return;
    }

    let selectedCategory = "all";
    const selectedColors = new Set();

    // حفظ ترتيب المنتجات الأصلي
    products.forEach(function (product, index) {
        product.dataset.originalIndex = index;
    });

    // توحيد أسماء الألوان
    function normalizeColor(color) {
        color = String(color || "").trim().toLowerCase();

        const aliases = {
            navy: "blue",
            olive: "green",
            grey: "gray"
        };

        return aliases[color] || color;
    }

    // رسالة عدم وجود منتجات
    let message = productsContainer.querySelector(
        ".men-filter-message"
    );

    if (!message) {
        message = document.createElement("p");
        message.className = "men-filter-message";
        message.textContent = "No products match your filters.";

        message.style.cssText =
            "grid-column:1/-1;text-align:center;padding:30px;display:none;";

        productsContainer.appendChild(message);
    }

    // الوظيفة الأساسية للفلترة
    function filterProducts() {

        const minText = minInput.value.trim();
        const maxText = maxInput.value.trim();

        const minPrice = minText === ""
            ? 0
            : Number(minText);

        const maxPrice = maxText === ""
            ? Infinity
            : Number(maxText);

        const invalidRange =
            !Number.isFinite(minPrice) ||
            minPrice < 0 ||
            (maxText !== "" &&
                (!Number.isFinite(maxPrice) || maxPrice < 0)) ||
            minPrice > maxPrice;

        let visibleCount = 0;

        // ترتيب المنتجات حسب الاختيار
        const sortedProducts = [...products];

        if (sortSelect.value === "price-low") {

            sortedProducts.sort(function (a, b) {
                return Number(a.dataset.price) -
                    Number(b.dataset.price);
            });

        } else if (sortSelect.value === "price-high") {

            sortedProducts.sort(function (a, b) {
                return Number(b.dataset.price) -
                    Number(a.dataset.price);
            });

        } else {

            sortedProducts.sort(function (a, b) {
                return Number(a.dataset.originalIndex) -
                    Number(b.dataset.originalIndex);
            });
        }

        sortedProducts.forEach(function (product) {

            const price = Number(product.dataset.price);

            const category = String(
                product.dataset.category || ""
            ).trim().toLowerCase();

            const productColors = String(
                product.dataset.color || ""
            )
                .split(/[\s,]+/)
                .filter(Boolean)
                .map(normalizeColor);

            // فلتر السعر
            const matchesPrice =
                !invalidRange &&
                Number.isFinite(price) &&
                price >= minPrice &&
                price <= maxPrice;

            // فلتر القسم
            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            // فلتر اللون
            const matchesColor =
                selectedColors.size === 0 ||
                productColors.some(function (color) {
                    return selectedColors.has(color);
                });

            // تطبيق كل الفلاتر معًا
            const showProduct =
                matchesPrice &&
                matchesCategory &&
                matchesColor;

            product.style.display = showProduct ? "" : "none";

            if (showProduct) {
                visibleCount++;
            }
        });

        // تطبيق ترتيب المنتجات
        sortedProducts.forEach(function (product) {
            productsContainer.appendChild(product);
        });

        productsContainer.appendChild(message);

        if (invalidRange) {
            message.textContent =
                "Enter a valid price range. Minimum must not exceed maximum.";
            message.style.display = "block";
        } else {
            message.textContent = "No products match your filters.";
            message.style.display =
                visibleCount === 0 ? "block" : "none";
        }
    }

    // تشغيل فلتر السعر عند الكتابة
    minInput.addEventListener("input", filterProducts);
    maxInput.addEventListener("input", filterProducts);

    // تشغيل فلتر الأقسام
    categoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            selectedCategory = button.dataset.filter
                .trim()
                .toLowerCase();

            categoryButtons.forEach(function (item) {
                const active = item === button;

                item.classList.toggle("active", active);
                item.setAttribute("aria-pressed", String(active));
            });

            filterProducts();
        });
    });

    // تشغيل فلتر الألوان
    colorButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const color = normalizeColor(button.dataset.color);

            if (selectedColors.has(color)) {
                selectedColors.delete(color);
            } else {
                selectedColors.add(color);
            }

            const active = selectedColors.has(color);

            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));

            filterProducts();
        });
    });

    // ترتيب الأسعار
    sortSelect.addEventListener("change", filterProducts);

    // تشغيل الفلتر عند فتح الصفحة
    filterProducts();

    console.log("STYLE STORE: Men filters loaded successfully.");

});
// نهايه  الفلتره الرجالي //













































































































































































/* =========================================
   STYLE STORE — MEN PRODUCT DETAILS
   ربط منتجات الرجال بصفحة التفاصيل
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // تفاصيل إضافية مختلفة لكل منتج حسب ترتيبه في men.html
    const menProductDetails = [
        {
            fit: "Relaxed Fit",
            material: "Cotton Blend",
            style: "Casual",
            colors: ["White", "Black", "Beige"],
            sizes: ["M", "L", "XL", "XXL"],
            description: "A coordinated casual outfit designed for comfortable everyday wear and a clean modern appearance.",
            highlights: ["Relaxed fit", "Soft cotton blend", "Easy everyday styling", "Modern coordinated look"]
        },
        {
            fit: "Regular Fit",
            material: "Cotton",
            style: "Smart Casual",
            colors: ["Black", "White", "Navy"],
            sizes: ["S", "M", "L", "XL"],
            description: "A clean formal shirt suitable for work, meetings and occasions where a polished look matters.",
            highlights: ["Classic collar", "Neat silhouette", "Easy to style", "Suitable for smart outfits"]
        },
        {
            fit: "Regular Fit",
            material: "Cotton Blend",
            style: "Casual",
            colors: ["Blue", "White", "Black"],
            sizes: ["S", "M", "L", "XL"],
            description: "A versatile casual shirt with a contemporary look that pairs well with jeans and chinos.",
            highlights: ["Modern casual design", "Comfortable fit", "Versatile styling", "Everyday wardrobe essential"]
        },
        {
            fit: "Regular Fit",
            material: "Faux Leather / Outerwear",
            style: "Urban",
            colors: ["Black", "Brown"],
            sizes: ["M", "L", "XL", "XXL"],
            description: "A statement jacket with a strong modern silhouette for layered outfits and cooler evenings.",
            highlights: ["Statement outerwear", "Modern silhouette", "Layer-friendly design", "Urban styling"]
        },
        {
            fit: "Regular Fit",
            material: "Cotton Blend",
            style: "Everyday",
            colors: ["Red", "Black", "White", "Navy"],
            sizes: ["S", "M", "L", "XL"],
            description: "A classic polo-inspired top for everyday outfits, combining a neat appearance with relaxed styling.",
            highlights: ["Classic polo style", "Easy everyday wear", "Versatile outfit pairing", "Timeless design"]
        },
        {
            fit: "Regular Fit",
            material: "Lightweight Blend",
            style: "Casual",
            colors: ["White", "Black", "Olive"],
            sizes: ["M", "L", "XL", "XXL"],
            description: "A casual outer layer designed to complement everyday outfits without making the look feel heavy.",
            highlights: ["Easy layering", "Clean casual look", "Versatile styling", "Suitable for daily outfits"]
        },
        {
            fit: "Tailored Fit",
            material: "Suiting Blend",
            style: "Formal",
            colors: ["Black", "Navy", "Beige"],
            sizes: ["S", "M", "L", "XL"],
            description: "A smart blazer-inspired piece for occasions that call for a refined and structured appearance.",
            highlights: ["Smart silhouette", "Formal styling", "Suitable for occasions", "Pairs with smart trousers"]
        },
        {
            fit: "Relaxed Fit",
            material: "Cotton Blend",
            style: "Streetwear",
            colors: ["White", "Black", "Olive"],
            sizes: ["M", "L", "XL", "XXL"],
            description: "A relaxed streetwear outfit made for casual styling, weekend plans and contemporary everyday looks.",
            highlights: ["Relaxed silhouette", "Streetwear-inspired look", "Easy outfit pairing", "Everyday versatility"]
        },
        {
            fit: "Oversized Fit",
            material: "Cotton",
            style: "Streetwear",
            colors: ["White", "Black", "Beige"],
            sizes: ["M", "L", "XL", "XXL"],
            description: "An oversized T-shirt with a relaxed silhouette for modern streetwear and comfortable casual outfits.",
            highlights: ["Oversized silhouette", "Casual styling", "Easy layering", "Modern streetwear look"]
        },
        {
            fit: "Regular Fit",
            material: "Cotton Blend",
            style: "Minimal",
            colors: ["White", "Black", "Navy"],
            sizes: ["S", "M", "L", "XL"],
            description: "A minimal everyday T-shirt with a clean appearance that works with jeans, shorts and layered outfits.",
            highlights: ["Minimal design", "Easy to combine", "Everyday essential", "Clean finish"]
        },
        {
            fit: "Regular Fit",
            material: "Lightweight Blend",
            style: "Urban Casual",
            colors: ["Black", "Olive", "Navy"],
            sizes: ["M", "L", "XL", "XXL"],
            description: "A bomber-inspired outer layer designed to bring a sporty urban touch to casual outfits.",
            highlights: ["Bomber-inspired design", "Urban appearance", "Layer-friendly", "Casual versatility"]
        },
        {
            fit: "Regular Fit",
            material: "Linen Blend",
            style: "Summer Casual",
            colors: ["Blue", "White", "Beige"],
            sizes: ["S", "M", "L", "XL"],
            description: "A lightweight shirt-inspired piece suited to warm-weather outfits and relaxed summer styling.",
            highlights: ["Lightweight feel", "Summer-inspired styling", "Relaxed appearance", "Easy to pair"]
        },
        {
            fit: "Classic Fit",
            material: "Cotton Blend",
            style: "Classic Casual",
            colors: ["Red", "Black", "Beige"],
            sizes: ["M", "L", "XL", "XXL"],
            description: "A coordinated classic outfit with a timeless casual look that can be styled for different daily occasions.",
            highlights: ["Classic appearance", "Comfort-focused design", "Easy coordination", "Versatile everyday styling"]
        },
        {
            fit: "Relaxed Fit",
            material: "Cotton Blend",
            style: "Casual",
            colors: ["Green", "Black", "Beige"],
            sizes: ["S", "M", "L", "XL"],
            description: "A casual sweatshirt-inspired piece for relaxed days, layering and comfortable everyday outfits.",
            highlights: ["Relaxed style", "Layer-friendly design", "Casual versatility", "Easy everyday pairing"]
        },
        {
            fit: "Regular Fit",
            material: "Cotton Blend",
            style: "Casual",
            colors: ["Red", "Blue", "Black"],
            sizes: ["S", "M", "L", "XL"],
            description: "A checked-shirt-inspired look for casual outfits, adding a little pattern to a simple wardrobe.",
            highlights: ["Pattern-inspired design", "Casual styling", "Versatile pairing", "Everyday wardrobe option"]
        },
        {
            fit: "Tailored Fit",
            material: "Suiting Blend",
            style: "Formal",
            colors: ["Green", "Black", "Navy"],
            sizes: ["S", "M", "L", "XL"],
            description: "A formal blazer-inspired piece for smart outfits, special occasions and polished everyday looks.",
            highlights: ["Tailored appearance", "Formal styling", "Structured silhouette", "Smart outfit pairing"]
        },
        {
            fit: "Relaxed Fit",
            material: "Cotton Blend",
            style: "Urban",
            colors: ["Blue", "Black", "White"],
            sizes: ["M", "L", "XL", "XXL"],
            description: "A contemporary urban outfit designed for relaxed styling and modern casual combinations.",
            highlights: ["Urban-inspired look", "Relaxed fit", "Modern styling", "Versatile combinations"]
        },
        {
            fit: "Regular Fit",
            material: "Outerwear Blend",
            style: "Winter Casual",
            colors: ["Black", "Navy", "Olive"],
            sizes: ["M", "L", "XL", "XXL"],
            description: "A winter-inspired jacket for layered outfits and a practical, modern cold-weather appearance.",
            highlights: ["Layer-friendly design", "Winter-inspired style", "Modern silhouette", "Casual versatility"]
        },
        {
            fit: "Regular Fit",
            material: "Lightweight Blend",
            style: "Summer Casual",
            colors: ["Red", "White", "Blue"],
            sizes: ["S", "M", "L", "XL"],
            description: "A lightweight summer-shirt-inspired piece for warm days, casual plans and easy seasonal styling.",
            highlights: ["Summer-inspired look", "Lightweight style", "Easy outfit pairing", "Casual versatility"]
        },
        {
            fit: "Modern Fit",
            material: "Premium Blend",
            style: "Smart Casual",
            colors: ["Red", "Black", "Navy"],
            sizes: ["M", "L", "XL", "XXL"],
            description: "A premium-inspired men's look designed for a more refined appearance while keeping styling versatile.",
            highlights: ["Refined appearance", "Modern styling", "Versatile outfit pairing", "Smart casual look"]
        }
    ];

    const menPage = document.querySelector(".men-page");

    /* 1. قراءة بيانات المنتجات من كروت men.html */

    if (menPage) {

        const cards = document.querySelectorAll(".men-card");
        const products = [];

        cards.forEach(function (card, index) {

            const image = card.querySelector("img");
            const name = card.querySelector(".men-info h2");
            const description = card.querySelector(".men-info p");
            const priceElement = card.querySelector(".men-price");
            const viewButton = card.querySelector(".men-button");

            if (!image || !name || !priceElement || !viewButton) {
                return;
            }

            const product = {
                id: "men-" + (index + 1),
                name: name.textContent.trim(),
                description: description ? description.textContent.trim() : "",
                image: image.getAttribute("src").replace(/\\/g, "/"),
                price: Number(
                    priceElement.textContent.replace(/[^\d]/g, "")
                ),
                category: card.dataset.category || "clothing",
                details: menProductDetails[index] || menProductDetails[0]
            };

            products.push(product);

            // كل زر يفتح نفس صفحة التفاصيل مع رقم المنتج الصحيح
            viewButton.href = "product.html?product=" + product.id;
        });

        // حفظ بيانات المنتجات لاستخدامها في product.html
        localStorage.setItem(
            "styleStoreMenProducts",
            JSON.stringify(products)
        );
    }

    /* 2. عرض المنتج المختار في product.html */

    const productPage = document.querySelector(".product-page");

    if (!productPage) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product");

    // لو الصفحة مفتوحة من غير اختيار منتج، اترك محتواها الأصلي
    if (!productId) {
        return;
    }

    let savedProducts = [];

    try {
        savedProducts = JSON.parse(
            localStorage.getItem("styleStoreMenProducts") || "[]"
        );
    } catch (error) {
        savedProducts = [];
    }

    const product = savedProducts.find(function (item) {
        return item.id === productId;
    });

    // لو المنتج غير موجود في البيانات المحفوظة، لا تغيّر الصفحة
    if (!product) {
        return;
    }

    const details = product.details;

    // اسم المنتج والقسم والوصف
    const categoryElement = document.querySelector(".product-category");
    const titleElement = document.querySelector(".product-info h1");
    const descriptionElement = document.querySelector(".product-info .product-description");
    const breadcrumb = document.querySelector(".breadcrumb");

    if (categoryElement) {
        categoryElement.textContent =
            "MEN " + product.category.replace(/-/g, " ").toUpperCase();
    }

    if (titleElement) {
        titleElement.textContent = product.name;
    }

    if (descriptionElement) {
        descriptionElement.textContent = details.description;
    }

    if (breadcrumb) {
        breadcrumb.textContent = "Home / Men / " + product.name;
    }

    // السعر بالجنيه المصري
    const oldPrice = document.querySelector(".product-price .old-price");
    const newPrice = document.querySelector(".product-price .new-price");

    if (oldPrice) {
        oldPrice.style.display = "none";
    }

    if (newPrice) {
        newPrice.textContent =
            "EGP " + product.price.toLocaleString("en-US");
    }

    // الصورة: نستخدم صورة الكارت الحقيقي للمنتج
    const mainImages = document.querySelectorAll(".main-product-image img");
    const thumbnails = document.querySelectorAll(".thumbnail-images img");

    mainImages.forEach(function (img, index) {
        if (index === 0) {
            img.src = product.image;
            img.alt = product.name;
            img.style.display = "";
        } else {
            img.style.display = "none";
        }
    });

    thumbnails.forEach(function (img, index) {
        if (index === 0) {
            img.src = product.image;
            img.alt = product.name;
            img.style.display = "";
        } else {
            img.style.display = "none";
        }
    });

    // التقييم يختلف من منتج لآخر
    const ratingElement = document.querySelector(".product-rating");

    if (ratingElement) {
        const reviewCount = 12 + Number(product.id.replace("men-", ""));
        ratingElement.textContent = "★★★★★ (" + reviewCount + " Reviews)";
    }

    // مميزات المنتج
    const highlightsList = document.querySelector(".highlights ul");

    if (highlightsList) {
        highlightsList.innerHTML = "";

        details.highlights.forEach(function (highlight) {
            const li = document.createElement("li");
            li.textContent = highlight;
            highlightsList.appendChild(li);
        });
    }

    // الألوان المتاحة
    const colorOptions = document.querySelector(".color-options");

    if (colorOptions) {
        colorOptions.innerHTML = "";

        details.colors.forEach(function (color, index) {
            const id = "product-color-" + index;

            const input = document.createElement("input");
            input.type = "radio";
            input.id = id;
            input.name = "product-color";
            input.value = color;

            const label = document.createElement("label");
            label.htmlFor = id;
            label.textContent = color;

            colorOptions.appendChild(input);
            colorOptions.appendChild(label);
        });
    }

    // المقاسات المتاحة
    const sizeOptions = document.querySelector(".size-options");

    if (sizeOptions) {
        sizeOptions.innerHTML = "";

        details.sizes.forEach(function (size, index) {
            const id = "product-size-" + index;

            const input = document.createElement("input");
            input.type = "radio";
            input.id = id;
            input.name = "product-size";
            input.value = size;

            const label = document.createElement("label");
            label.htmlFor = id;
            label.textContent = size;

            sizeOptions.appendChild(input);
            sizeOptions.appendChild(label);
        });
    }

    // أقسام التفاصيل الموجودة أسفل صفحة المنتج
    const sections = document.querySelectorAll(".details-section");

    // الوصف التفصيلي
    if (sections[0]) {
        const paragraph = sections[0].querySelector("p");

        if (paragraph) {
            paragraph.textContent = details.description;
        }
    }

    // المواصفات
    if (sections[1]) {
        const specifications = sections[1].querySelector(".specifications");

        if (specifications) {
            specifications.innerHTML = "";

            const specs = [
                ["Fit", details.fit],
                ["Material", details.material],
                ["Style", details.style],
                ["Category", product.category.replace(/-/g, " ")]
            ];

            specs.forEach(function (spec) {
                const div = document.createElement("div");
                const strong = document.createElement("strong");

                strong.textContent = spec[0] + ": ";
                div.appendChild(strong);
                div.appendChild(document.createTextNode(spec[1]));

                specifications.appendChild(div);
            });
        }
    }

    // دليل المقاسات
    if (sections[2]) {
        const table = sections[2].querySelector("table");

        if (table) {
            table.innerHTML = `
                <tr>
                    <th>Size</th>
                    <th>Waist</th>
                    <th>Length</th>
                </tr>
            `;

            details.sizes.forEach(function (size, index) {
                const row = document.createElement("tr");
                const waist = document.createElement("td");
                const length = document.createElement("td");
                const sizeCell = document.createElement("td");

                sizeCell.textContent = size;
                waist.textContent = (76 + index * 4) + " cm";
                length.textContent = (100 + index * 2) + " cm";

                row.append(sizeCell, waist, length);
                table.appendChild(row);
            });
        }
    }

    // العناية بالمنتج
    if (sections[3]) {
        const list = sections[3].querySelector("ul");

        if (list) {
            list.innerHTML = "";

            [
                "Follow the care label on the garment",
                "Wash with similar colors",
                "Use a suitable washing cycle",
                "Avoid harsh bleach"
            ].forEach(function (tip) {
                const li = document.createElement("li");
                li.textContent = tip;
                list.appendChild(li);
            });
        }
    }

    // لماذا ستعجبك القطعة؟
    if (sections[4]) {
        const paragraph = sections[4].querySelector("p");

        if (paragraph) {
            paragraph.textContent =
                product.name + ": " + details.description +
                " Explore the available sizes and colors before ordering.";
        }
    }

    // الأسئلة الشائعة الخاصة بالقطعة
    if (sections[7]) {
        const faqItems = sections[7].querySelectorAll(".faq-item");

        if (faqItems[0]) {
            faqItems[0].querySelector("h3").textContent =
                "Which sizes are available for " + product.name + "?";

            faqItems[0].querySelector("p").textContent =
                "Available sizes: " + details.sizes.join(", ") + ".";
        }

        if (faqItems[1]) {
            faqItems[1].querySelector("h3").textContent =
                "What material is this product made from?";

            faqItems[1].querySelector("p").textContent =
                "The listed material is " + details.material +
                ". Check the garment label for exact care instructions.";
        }
    }

    // منتجات مقترحة من نفس قسم الرجال
    const relatedGrid = document.querySelector(".related-grid");

    if (relatedGrid) {
        const relatedProducts = savedProducts
            .filter(function (item) {
                return item.id !== product.id;
            })
            .slice(0, 3);

        relatedGrid.innerHTML = "";

        relatedProducts.forEach(function (item) {
            const link = document.createElement("a");
            link.href = "product.html?product=" + item.id;
            link.className = "related-card";

            const image = document.createElement("img");
            image.src = item.image;
            image.alt = item.name;

            const heading = document.createElement("h3");
            heading.textContent = item.name;

            const price = document.createElement("p");
            price.textContent =
                "EGP " + item.price.toLocaleString("en-US");

            link.append(image, heading, price);
            relatedGrid.appendChild(link);
        });
    }

});









































































































document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // STYLE STORE — ADD TO CART
    // إضافة المنتجات إلى السلة
    // =====================================

    const menCards = document.querySelectorAll(".men-card");

    menCards.forEach(function (card) {

        const addButton = card.querySelector(".men-cart-link");

        if (!addButton) return;

        addButton.addEventListener("click", function (event) {

            event.preventDefault();

            const nameElement = card.querySelector(".men-info h2");
            const descriptionElement = card.querySelector(".men-info p");
            const imageElement = card.querySelector("img");

            if (!nameElement || !imageElement) return;

            const name = nameElement.textContent.trim();
            const description = descriptionElement
                ? descriptionElement.textContent.trim()
                : "";

            const image = imageElement.getAttribute("src");
            const price = Number(card.dataset.price);

            if (!Number.isFinite(price) || price <= 0) {
                showCartNotification("تعذر قراءة سعر المنتج");
                return;
            }

            // قراءة السلة المحفوظة
            let cart = [];

            try {
                cart = JSON.parse(
                    localStorage.getItem("styleStoreCart")
                ) || [];

                if (!Array.isArray(cart)) {
                    cart = [];
                }
            } catch (error) {
                cart = [];
            }

            // هل المنتج موجود بالفعل؟
            const existingProduct = cart.find(function (product) {
                return product.id === name;
            });

            if (existingProduct) {
                existingProduct.quantity =
                    Number(existingProduct.quantity || 0) + 1;
            } else {
                cart.push({
                    id: name,
                    name: name,
                    description: description,
                    image: image,
                    price: price,
                    quantity: 1
                });
            }

            // حفظ السلة
            localStorage.setItem(
                "styleStoreCart",
                JSON.stringify(cart)
            );

            // إشعار غير مزعج
            showCartNotification(
                "تمت إضافة " + name + " إلى السلة"
            );

        });

    });

});


// =====================================
// CART NOTIFICATION
// إشعار إضافة المنتج
// =====================================

function showCartNotification(message) {

    let notification = document.getElementById("cart-notification");

    if (!notification) {

        notification = document.createElement("div");

        notification.id = "cart-notification";

        document.body.appendChild(notification);

        notification.style.cssText = `
            position: fixed;
            bottom: 25px;
            right: 25px;
            max-width: calc(100vw - 40px);
            background: #ffffff;
            color: #333333;
            padding: 16px 22px;
            border-right: 4px solid #c8a96b;
            border-radius: 8px;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
            z-index: 99999;
            font-size: 15px;
            font-family: Arial, sans-serif;
            direction: rtl;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;
    }

    notification.textContent = "✓ " + message;

    notification.style.opacity = "1";
    notification.style.transform = "translateY(0)";

    clearTimeout(window.cartNotificationTimer);

    window.cartNotificationTimer = setTimeout(function () {

        notification.style.opacity = "0";
        notification.style.transform = "translateY(10px)";

        setTimeout(function () {
            notification.remove();
        }, 300);

    }, 2500);

}




































document.addEventListener("DOMContentLoaded", function () {
    const cartSection = document.querySelector(".cart-section");
    const summary = document.querySelector(".order-summary");

    // تشغيل الكود داخل صفحة السلة فقط
    if (!cartSection || !summary) return;

    const cartContainer = cartSection.querySelector(".cart-item");
    const summaryProduct = summary.querySelector(".summary-product");
    const summaryLines = summary.querySelector(".summary-lines");
    const summaryTotal = summary.querySelector(".summary-total strong");

    if (!cartContainer || !summaryProduct || !summaryLines || !summaryTotal) {
        return;
    }

    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');

    // تكلفة التوصيل بالجنيه المصري — يمكن تغييرها
    const deliveryPrices = [100, 180];

    // قراءة المنتجات المحفوظة
    function getCart() {
        try {
            const products = JSON.parse(
                localStorage.getItem("styleStoreCart")
            );

            return Array.isArray(products) ? products : [];
        } catch (error) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem("styleStoreCart", JSON.stringify(cart));
    }

    function money(amount) {
        return Number(amount).toLocaleString("en-EG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + " EGP";
    }

    function getShipping() {
        const selectedIndex = Array.from(deliveryOptions).findIndex(
            option => option.checked
        );

        return selectedIndex === 1
            ? deliveryPrices[1]
            : deliveryPrices[0];
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;

        return element;
    }

    function renderCart() {
        const cart = getCart();

        // عرض المنتجات داخل السلة
        cartContainer.replaceChildren();
        cartContainer.className = "cart-items-list";

        if (cart.length === 0) {
            const emptyMessage = createElement(
                "p",
                "cart-empty-message",
                "سلتك فارغة حاليًا. تصفح المنتجات وأضف ما يعجبك!"
            );

            cartContainer.appendChild(emptyMessage);
        } else {
            cart.forEach(function (product, index) {
                const item = createElement("div", "cart-item");

                const imageBox = createElement("div", "cart-item-image");
                const image = document.createElement("img");

                image.src = product.image || "";
                image.alt = product.name || "Product";
                image.loading = "lazy";
                imageBox.appendChild(image);

                const info = createElement("div", "cart-item-info");
                info.appendChild(
                    createElement("span", "", "STYLE STORE")
                );
                info.appendChild(
                    createElement("h3", "", product.name || "Product")
                );

                if (product.description) {
                    info.appendChild(
                        createElement("p", "", product.description)
                    );
                }

                const details = createElement("div", "product-details");
                details.appendChild(
                    createElement("span", "", "Quantity: " + product.quantity)
                );
                info.appendChild(details);

                info.appendChild(
                    createElement("strong", "", money(product.price))
                );

                const actions = createElement("div", "cart-item-actions");

                const decrease = createElement("button", "", "−")
                decrease.type = "button";
                decrease.setAttribute("aria-label", "Decrease quantity");

                const quantity = createElement(
                    "span",
                    "",
                    String(product.quantity)
                );

                const increase = createElement("button", "", "+");
                increase.type = "button";
                increase.setAttribute("aria-label", "Increase quantity");

                const remove = createElement("button", "", "Remove");
                remove.type = "button";
                remove.className = "cart-remove-button";

                decrease.addEventListener("click", function () {
                    const latestCart = getCart();

                    if (!latestCart[index]) return;

                    latestCart[index].quantity = Math.max(
                        1,
                        Number(latestCart[index].quantity || 1) - 1
                    );

                    saveCart(latestCart);
                    renderCart();
                });

                increase.addEventListener("click", function () {
                    const latestCart = getCart();

                    if (!latestCart[index]) return;

                    latestCart[index].quantity =
                        Number(latestCart[index].quantity || 1) + 1;

                    saveCart(latestCart);
                    renderCart();
                });

                remove.addEventListener("click", function () {
                    const latestCart = getCart();

                    latestCart.splice(index, 1);
                    saveCart(latestCart);
                    renderCart();
                });

                actions.append(decrease, quantity, increase, remove);
                item.append(imageBox, info, actions);
                cartContainer.appendChild(item);
            });
        }

        // حساب الإجمالي
        const subtotal = cart.reduce(function (sum, product) {
            const price = Number(product.price) || 0;
            const quantity = Math.max(1, Number(product.quantity) || 1);

            return sum + price * quantity;
        }, 0);

        const shipping = cart.length ? getShipping() : 0;
        const discount = 0;
        const total = subtotal + shipping - discount;

        // تحديث ملخص الطلب
        summaryProduct.replaceChildren();

        if (cart.length === 0) {
            summaryProduct.appendChild(
                createElement("span", "", "لا توجد منتجات في السلة")
            );
        } else {
            cart.forEach(function (product) {
                const details = createElement("div");

                details.appendChild(
                    createElement("strong", "", product.name)
                );

                details.appendChild(
                    createElement(
                        "span",
                        "",
                        "×" + product.quantity
                    )
                );

                summaryProduct.appendChild(details);
                summaryProduct.appendChild(
                    createElement(
                        "strong",
                        "",
                        money(Number(product.price) * Number(product.quantity))
                    )
                );
            });
        }

        summaryLines.replaceChildren();

        [
            ["Subtotal", subtotal],
            ["Shipping", shipping],
            ["Discount", discount]
        ].forEach(function (line) {
            const row = createElement("div");
            row.appendChild(createElement("span", "", line[0]));
            row.appendChild(createElement("strong", "", money(line[1])));
            summaryLines.appendChild(row);
        });

        summaryTotal.textContent = money(total);

        // منع إتمام الطلب والسلة فارغة
        const placeOrder = summary.querySelector(".place-order");

        if (placeOrder) {
            placeOrder.disabled = cart.length === 0;
            placeOrder.style.opacity = cart.length === 0 ? "0.5" : "1";
            placeOrder.style.cursor = cart.length === 0
                ? "not-allowed"
                : "pointer";
        }
    }

    // اختيار التوصيل وتحديث السعر
    deliveryOptions.forEach(function (option, index) {
        option.value = String(index);

        option.addEventListener("change", renderCart);
    });

    // التوصيل العادي هو الاختيار الافتراضي
    if (deliveryOptions.length && !Array.from(deliveryOptions).some(
        option => option.checked
    )) {
        deliveryOptions[0].checked = true;
    }

    renderCart();
});















































































































































































/* =========================================================
   STYLE STORE — ORDER SUCCESS
   عرض بيانات الطلب داخل عناصر HTML الموجودة
   لا يمسح الصفحة ولا يعطل التنقل
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // لا تشغّل هذا الجزء إلا في صفحة تأكيد الطلب
    const page = document.querySelector(".order-success-page");

    if (!page) {
        return;
    }

    const ORDER_KEY = "styleStoreLastOrder";

    /* =====================================================
       تنسيق السعر
    ===================================================== */

    function formatMoney(value) {
        const amount = Number(value);

        return "EGP " + (Number.isFinite(amount) ? amount : 0)
            .toLocaleString("en-EG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
    }

    /* =====================================================
       تحديث النصوص بأمان
    ===================================================== */

    function setText(id, value, fallback) {
        const element = document.getElementById(id);

        if (!element) {
            return;
        }

        const text = value === undefined ||
            value === null ||
            value === ""
                ? (fallback || "—")
                : String(value);

        element.textContent = text;
    }

    /* =====================================================
       قراءة الطلب المحفوظ
    ===================================================== */

    function getSavedOrder() {
        try {
            const savedOrder = localStorage.getItem(ORDER_KEY);

            if (!savedOrder) {
                return null;
            }

            const order = JSON.parse(savedOrder);

            if (
                !order ||
                typeof order !== "object" ||
                !order.customer ||
                !Array.isArray(order.items)
            ) {
                return null;
            }

            return order;
        } catch (error) {
            console.error("STYLE STORE: Error reading order", error);
            return null;
        }
    }

    /* =====================================================
       إظهار حالة الطلب ورسالة الخطأ
    ===================================================== */

    function showOrderMessage(message) {
        setText("success-status", message);

        const products = document.getElementById("success-products");

        if (products) {
            const paragraph = document.createElement("p");
            paragraph.className = "success-loading";
            paragraph.textContent = message;

            products.replaceChildren(paragraph);
        }
    }

    /* =====================================================
       بيانات العميل
    ===================================================== */

    function renderCustomer(order) {
        const customer = order.customer || {};

        setText("success-name", customer.name);
        setText("success-phone", customer.phone);
        setText("success-email", customer.email);
        setText("success-address", customer.address);
        setText("success-city", customer.city);
        setText("success-country", customer.country);

        setText(
            "success-notes",
            customer.notes,
            "لا توجد ملاحظات"
        );

        // تاريخ الطلب
        let dateText = "—";

        if (order.createdAt) {
            const date = new Date(order.createdAt);

            if (!Number.isNaN(date.getTime())) {
                dateText = date.toLocaleString("ar-EG");
            }
        }

        setText("success-order-date", dateText);

        // طريقة التوصيل
        const deliveryIndex = Number(order.deliveryIndex);

        let deliveryText = order.delivery || order.deliveryMethod || "";

        if (deliveryIndex === 0) {
            deliveryText = "التوصيل العادي";
        } else if (deliveryIndex === 1) {
            deliveryText = "التوصيل السريع";
        }

        setText(
            "success-delivery",
            deliveryText,
            "لم يتم تحديد طريقة التوصيل"
        );

        // طريقة الدفع
        const payment = String(
            order.paymentMethod || order.payment || ""
        ).toLowerCase();

        let paymentText = payment;

        if (payment === "cash") {
            paymentText = "الدفع عند الاستلام";
        } else if (payment === "card") {
            paymentText = "الدفع بالبطاقة";
        }

        setText(
            "success-payment",
            paymentText,
            "لم يتم تحديد طريقة الدفع"
        );

        setText(
            "success-status",
            order.status || "تم تسجيل الطلب"
        );
    }

    /* =====================================================
       تفاصيل المنتجات
    ===================================================== */

    function renderProducts(order) {
        const container = document.getElementById("success-products");

        if (!container) {
            console.error("STYLE STORE: success-products not found");
            return;
        }

        // نمسح محتويات قائمة المنتجات فقط
        container.replaceChildren();

        if (order.items.length === 0) {
            const message = document.createElement("p");
            message.textContent = "لا توجد منتجات محفوظة في هذا الطلب.";
            container.appendChild(message);
            return;
        }

        order.items.forEach(function (product) {
            const item = document.createElement("article");
            item.className = "success-product-item";

            const imageSource = product.image || product.imageUrl || "";

            if (imageSource) {
                const image = document.createElement("img");

                image.src = imageSource;
                image.alt = product.name || product.title || "منتج";
                image.loading = "lazy";

                image.style.cssText =
                    "width:90px;height:100px;object-fit:contain;";

                image.addEventListener("error", function () {
                    image.style.display = "none";
                });

                item.appendChild(image);
            }

            const details = document.createElement("div");
            details.className = "success-product-details";

            const name = document.createElement("h3");
            name.textContent =
                product.name || product.title || "منتج من STYLE STORE";

            details.appendChild(name);

            const quantity = Math.max(
                1,
                Math.floor(Number(product.quantity) || 1)
            );

            const price = Math.max(
                0,
                Number(product.price) || 0
            );

            const quantityText = document.createElement("p");
            quantityText.textContent = "الكمية: " + quantity;
            details.appendChild(quantityText);

            const priceText = document.createElement("p");
            priceText.textContent = "سعر القطعة: " + formatMoney(price);
            details.appendChild(priceText);

            const totalText = document.createElement("strong");
            totalText.textContent =
                "إجمالي المنتج: " + formatMoney(price * quantity);

            details.appendChild(totalText);
            item.appendChild(details);

            // تنسيق العنصر دون الحاجة إلى تعديل HTML
            item.style.cssText =
                "display:flex;align-items:center;gap:16px;" +
                "flex-wrap:wrap;padding:14px;margin-bottom:12px;" +
                "border:1px solid #eee;border-radius:8px;";

            details.style.flex = "1";

            container.appendChild(item);
        });
    }

    /* =====================================================
       حساب وعرض الإجماليات
    ===================================================== */

    function renderTotals(order) {
        const calculatedSubtotal = order.items.reduce(
            function (sum, product) {
                const price = Math.max(
                    0,
                    Number(product.price) || 0
                );

                const quantity = Math.max(
                    1,
                    Number(product.quantity) || 1
                );

                return sum + price * quantity;
            },
            0
        );

        const subtotal = order.subtotal !== undefined &&
            order.subtotal !== null &&
            order.subtotal !== ""
                ? Number(order.subtotal)
                : calculatedSubtotal;

        const shipping = Number(order.shipping) || 0;
        const discount = Number(order.discount) || 0;

        const total = order.total !== undefined &&
            order.total !== null &&
            order.total !== ""
                ? Number(order.total)
                : subtotal + shipping - discount;

        setText("success-subtotal", formatMoney(subtotal));
        setText("success-shipping", formatMoney(shipping));
        setText("success-discount", "- " + formatMoney(discount));
        setText("success-total", formatMoney(total));
    }

    /* =====================================================
       تشغيل عرض الطلب
    ===================================================== */

    const order = getSavedOrder();

    if (!order) {
        showOrderMessage(
            "لم يتم العثور على طلب محفوظ. ارجع إلى صفحة إتمام الطلب وحاول مرة أخرى."
        );

        console.warn(
            "STYLE STORE: No valid order found in localStorage."
        );

        return;
    }

    renderCustomer(order);
    renderProducts(order);
    renderTotals(order);

    console.log("STYLE STORE: Order details displayed successfully.");

});



































































