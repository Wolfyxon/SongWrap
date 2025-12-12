
export function preloadImage(src: string, timeout: number = 10000): Promise<boolean> {
    return new Promise((resolve) => {
        const img = document.createElement("img");
        let complete = false;

        img.style.position = "absolute";
        img.style.top = "10000%";
        img.src = src;

        function done(result: boolean) {
            if(complete)
                return;

            complete = true;
            img.remove();
            resolve(result);
        }

        img.onload = () => done(true);
        img.onerror = () => done(false);

        setTimeout(() => done(false), timeout);

        document.body.append(img);
    });
}
