from PIL import Image, ImageDraw

def flood_fill_transparent(input_path, output_path, tolerance=15):
    # Open image and convert to RGBA
    img = Image.open(input_path).convert("RGBA")
    
    # We will flood fill from the 4 corners
    corners = [(0, 0), (img.width - 1, 0), (0, img.height - 1), (img.width - 1, img.height - 1)]
    
    # Target color to replace (get from top-left pixel)
    target_color = img.getpixel((0, 0))
    
    # Replacement color (transparent)
    replace_color = (0, 0, 0, 0)
    
    # We implement a custom flood fill because ImageDraw.floodfill doesn't work well with transparency directly
    # doing it manually with a queue
    pixels = img.load()
    
    def color_distance(c1, c2):
        return sum(abs(a - b) for a, b in zip(c1[:3], c2[:3]))
    
    visited = set()
    queue = corners.copy()
    
    while queue:
        x, y = queue.pop(0)
        
        if (x, y) in visited:
            continue
            
        visited.add((x, y))
        
        if x < 0 or x >= img.width or y < 0 or y >= img.height:
            continue
            
        current_color = pixels[x, y]
        
        if color_distance(current_color, target_color) <= tolerance:
            pixels[x, y] = replace_color
            queue.append((x + 1, y))
            queue.append((x - 1, y))
            queue.append((x, y + 1))
            queue.append((x, y - 1))

    img.save(output_path, "PNG")
    print(f"Saved transparent image to {output_path}")

try:
    flood_fill_transparent("src/assets/randi.jpg", "src/assets/randi-nobg2.png")
except Exception as e:
    print("Error:", e)
