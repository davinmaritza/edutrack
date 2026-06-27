import os
from PIL import Image, ImageChops

def make_transparent(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    datas = img.getdata()
    
    # The background color is a light grey. Let's sample the top-left pixel.
    bg_color = datas[0]
    print(f"Sampled background color: {bg_color}")
    
    new_data = []
    for item in datas:
        # If the pixel is close to the background color, make it transparent.
        # We calculate the distance in RGB space.
        dist = sum((item[i] - bg_color[i]) ** 2 for i in range(3)) ** 0.5
        if dist < 25: # Tolerance threshold
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Auto-crop the transparent image to its bounding box
    bg = Image.new(img.mode, img.size, (0, 0, 0, 0))
    diff = ImageChops.difference(img, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved transparent cropped logo to {output_path}")
    return img

if __name__ == "__main__":
    src = "public/logo-cube.png"
    dest = "public/logo-cube-transparent.png"
    
    if os.path.exists(src):
        logo_img = make_transparent(src, dest)
        
        # Save to various sizes and locations
        # 1. Overwrite public/logo.png
        logo_img.save("public/logo.png")
        
        # 2. Overwrite public/apple-icon.png
        apple_icon = logo_img.resize((180, 180), Image.Resampling.LANCZOS)
        apple_icon.save("public/apple-icon.png")
        
        # 3. Overwrite public/icon-light-32x32.png and public/icon-dark-32x32.png
        icon_32 = logo_img.resize((32, 32), Image.Resampling.LANCZOS)
        icon_32.save("public/icon-light-32x32.png")
        icon_32.save("public/icon-dark-32x32.png")
        
        # 4. Save a high-res icon.png
        icon_512 = logo_img.resize((512, 512), Image.Resampling.LANCZOS)
        icon_512.save("public/icon.png")
        
        print("Logo processing completed successfully!")
    else:
        print(f"Error: {src} not found.")
