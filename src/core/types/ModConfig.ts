type ModConfig = {
    disabled?: boolean;
    enableDevTools?: boolean;
    pageFilters: {
        url?: string;
        title?: string;
        urlContains?: string;
        titleContains?: string;
        id?: string;
    }[];
}

export type { ModConfig };