from PIL import Image

def remove_light_background(input_path, output_path, threshold=210):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Check if the pixel is light gray/white (R, G, B > threshold)
        # We also check if the difference between RGB is small to ensure it's gray/white, not a light color like skin
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            diff_rg = abs(item[0] - item[1])
            diff_gb = abs(item[1] - item[2])
            diff_br = abs(item[2] - item[0])
            if diff_rg < 20 and diff_gb < 20 and diff_br < 20:
                newData.append((255, 255, 255, 0)) # transparent
                continue
        newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print("Saved transparent image to", output_path)

remove_light_background("src/assets/randi.jpg", "src/assets/randi-nobg.png")
