// src/lib/cropUtils.ts

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // لتجنب مشاكل CORS
    image.src = url;
  });

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // تعيين أبعاد الـ Canvas لتطابق المنطقة المقصوصة
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // رسم الجزء المقصوص من الصورة الأصلية
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // إرجاع الصورة كـ Base64 لسهولة عرضها ورفعها
  return new Promise((resolve) => {
    resolve(canvas.toDataURL("image/jpeg"));
  });
}