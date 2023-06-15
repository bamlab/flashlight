import json
import sys
import matplotlib.pyplot as plt
from numpy import mean

from chart_plot import plot_perf

# extract the cycle-weight value and the sample-time value from a row
def filter_data(data):
    new_data = []
    acount = 0
    bcount = 0
    for row in data:
        if "@text" not in row["row"]["@children"][5]["cycle-weight"]:
            json.dump(row["row"]["@children"][5], sys.stdout, indent=2)
            break
            continue
        if "@text" not in row["row"]["@children"][0]["sample-time"]:
            bcount += 1
            continue
        new_data.append((int(row["row"]["@children"][0]["sample-time"]["@text"]), int(row["row"]["@children"][5]["cycle-weight"]["@text"])))
    
    print(len(data), len(new_data), acount, bcount)
    return new_data


def get_rows(data):
    return data["trace-query-result"]["@children"][0]["node"]["@children"][1:]


def rolling_mean_one_file(file):
    with open(file) as json_file:
      data = json.load(json_file)
    rows = get_rows(data)
    filtered_data = filter_data(rows)
    # json.dump(filtered_data, sys.stdout, indent=2)
        
def main(file):
    rolling_mean_one_file(file)


if __name__ == "__main__":
    # take the json file as input
    if sys.argv[1] == None :
        print("No file given")
        sys.exit(1)
    file = sys.argv[1]
    main(file)