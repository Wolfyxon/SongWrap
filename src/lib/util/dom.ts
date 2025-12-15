import { wait } from ".";

export function preloadImage(src: string, timeout: number = 10000): Promise<boolean> {
    return new Promise((resolve) => {
        const img = document.createElement("img");
        let complete = false;

        img.style.position = "absolute";
        img.style.opacity = "0.01"
        img.style.top = "0";
        img.width = 50;
        img.height = 50;
        img.src = src;

        async function done(result: boolean) {
            if(complete)
                return;

            complete = true;

            await wait(10);

            img.remove();
            resolve(result);
        }

        img.onload = () => done(true);
        img.onerror = () => done(false);

        setTimeout(() => done(false), timeout);

        document.body.append(img);
    });
}
