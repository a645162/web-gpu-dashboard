export const isDarkMode = () => {
    return document.documentElement.classList.contains('dark');
}

export const getSystemTheme = () => {
    return window
        .matchMedia('(prefers-color-scheme: dark)')
        .matches;
}

export const setDarkMode = (isDarkMode: boolean) => {
    const htmlElement = document.documentElement;

    if (isDarkMode) {
        // Set to DarkMode

        htmlElement.classList.remove('light');
        htmlElement.classList.add('dark');

        document.body.style.color = "white";
        document.body.style.backgroundColor = "black";
    } else {
        // Set to LightMode

        htmlElement.classList.add('light');
        htmlElement.classList.remove('dark');

        document.body.style.color = "black";
        document.body.style.backgroundColor = "white";
    }
}
