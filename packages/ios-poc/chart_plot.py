import json
import matplotlib.pyplot as plt
from PIL import Image
import matplotlib.ticker as ticker

def read_data(raw_data):
    time = [item[0] for item in raw_data]
    values = [item[1] for item in raw_data]
    return time, values

def time_formatter(x, pos):
    s, ms = divmod(int(x), 1000)
    return f'{s}:{ms:03d}'


def plot_perf(data):
    # Read data from JSON files
    time, values = read_data(data)

    # Create a figure
    fig = plt.figure(figsize=(12, 8))

    ax1 = fig.add_subplot(111)
    # Draw the bar in the subplot
    bar_width = 1000
    ax1.bar([t/1e6 for t in time_no_sr], values_no_sr, width=bar_width, label='Without SR', alpha=0.5)
    ax1.bar([t/1e6 for t in time_sr], values_sr, width=bar_width, label='With SR', alpha=0.5)
    
    
    # Apply the custom formatter to the x-axis
    ax1.xaxis.set_major_formatter(ticker.FuncFormatter(time_formatter))

    # Draw average lines for each dataset
    ax1.axhline(y=avg_values_no_sr, color='blue', linestyle='--', label='Avg Without SR')
    ax1.axhline(y=avg_values_sr, color='orange', linestyle='--', label='Avg SR')


    # Draw peak lines for each dataset
    ax1.axhline(y=peak_values_no_sr, color='blue', linestyle=':', label='Peak Without SR')
    ax1.axhline(y=peak_values_sr, color='orange', linestyle=':', label='Peak With SR')


    # Customize the bar plot
    ax1.set_xlabel('Time (s:ms)')
    ax1.set_ylabel('Values (CPU Cycles)')
    ax1.set_title('Rolling mean of CPU Cycles over Time from CPU-Profile Trace (Instruments)', fontweight='bold', fontsize=16)
    ax1.legend()

    # Save the figure as an image
    plt.savefig('./nubt_plot.png', dpi=300, bbox_inches='tight')

    # Optionally, display the image using PIL
    img = Image.open('./nubt_plot.png')
    img.show()

if __name__ == '__main__':
    plot_perf(None, None)