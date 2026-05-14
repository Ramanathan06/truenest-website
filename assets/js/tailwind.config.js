tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                /* ── DOMINANT: deep ink dark surfaces (Volna palette) ── */
                "background":               "#0F0F0E",
                "surface":                  "#0F0F0E",
                "surface-bright":           "#2C2B27",
                "surface-container-lowest": "#0F0F0E",
                "surface-container-low":    "#1A1917",
                "surface-container":        "#22211E",
                "surface-container-high":   "#2C2B27",
                "surface-container-highest":"#3A3833",
                "surface-dim":              "#0A0A09",
                "surface-variant":          "#1A1917",
                "inverse-on-surface":       "#0F0F0E",
                "inverse-surface":          "#F5F0EB",

                /* ── Cream text on dark ── */
                "on-background":            "#F5F0EB",
                "on-surface":               "#F5F0EB",
                "forest":                   "#0F0F0E",
                "forest-mid":               "#1A1917",
                "forest-light":             "#22211E",

                /* ── SECONDARY: sage green ── */
                "secondary":                "#8A9A7B",
                "secondary-container":      "#2C2B27",
                "secondary-fixed":          "#A7B89A",
                "secondary-fixed-dim":      "#6B7A5E",
                "on-secondary":             "#0F0F0E",
                "on-secondary-container":   "#F5F0EB",
                "on-secondary-fixed":       "#0F0F0E",
                "on-secondary-fixed-variant":"#6B7A5E",

                /* ── ACCENT: copper ── */
                "primary":                  "#C17F59",
                "primary-fixed":            "#D4A07A",
                "primary-fixed-dim":        "#E8B894",
                "primary-container":        "#22211E",
                "inverse-primary":          "#D4A07A",
                "surface-tint":             "#C17F59",
                "on-primary":               "#0F0F0E",
                "on-primary-fixed":         "#0F0F0E",
                "on-primary-fixed-variant": "#3A3833",
                "on-primary-container":     "#D4A07A",

                /* ── Tertiary: gold / terracotta ── */
                "tertiary":                 "#C9A96E",
                "tertiary-container":       "#2C2B27",
                "tertiary-fixed":           "#DFC08A",
                "tertiary-fixed-dim":       "#C9A96E",
                "on-tertiary":              "#0F0F0E",
                "on-tertiary-container":    "#DFC08A",
                "on-tertiary-fixed":        "#0F0F0E",
                "on-tertiary-fixed-variant":"#6B675E",

                /* ── Neutrals ── */
                "on-surface-variant":       "#9C9789",
                "outline":                  "#6B675E",
                "outline-variant":          "#3A3833",

                /* ── Error ── */
                "error":                    "#ba1a1a",
                "error-container":          "#3a1a1a",
                "on-error":                 "#ffffff",
                "on-error-container":       "#ffdad6",
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                full: "9999px"
            },
            spacing: {
                "container-max": "1440px",
                "margin-mobile": "20px",
                "margin-desktop": "64px",
                gutter: "32px",
                unit: "8px",
                "section-gap": "128px"
            },
            fontFamily: {
                "headline-lg":         ["Playfair Display", "Georgia", "serif"],
                "body-md":             ["Inter", "system-ui", "sans-serif"],
                "body-lg":             ["Inter", "system-ui", "sans-serif"],
                "headline-lg-mobile":  ["Playfair Display", "Georgia", "serif"],
                "headline-xl":         ["Playfair Display", "Georgia", "serif"],
                "display-lg":          ["Playfair Display", "Georgia", "serif"],
                "label-caps":          ["Inter", "system-ui", "sans-serif"],
                "display-xl":          ["Playfair Display", "Georgia", "serif"]
            },
            fontSize: {
                "headline-lg":        ["36px", { lineHeight: "44px", fontWeight: "400" }],
                "body-md":            ["16px", { lineHeight: "26px", fontWeight: "400" }],
                "body-lg":            ["18px", { lineHeight: "30px", fontWeight: "400" }],
                "headline-lg-mobile": ["28px", { lineHeight: "34px", fontWeight: "400" }],
                "headline-xl":        ["48px", { lineHeight: "56px", fontWeight: "400" }],
                "display-lg":         ["60px", { lineHeight: "68px", letterSpacing: "-0.02em", fontWeight: "400" }],
                "label-caps":         ["12px", { lineHeight: "16px", letterSpacing: "0.15em", fontWeight: "500" }],
                "display-xl":         ["84px", { lineHeight: "92px", letterSpacing: "-0.02em", fontWeight: "400" }]
            }
        }
    }
};
