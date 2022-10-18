import { processOutput } from "../pollRamUsage";

const SAMPLE_OUTPUT = `Applications Memory Usage (in Kilobytes):
Uptime: 7096575 Realtime: 8873759

** MEMINFO in pid 17749 [com.example] **
                   Pss  Private  Private  SwapPss     Heap     Heap     Heap
                 Total    Dirty    Clean    Dirty     Size    Alloc     Free
                ------   ------   ------   ------   ------   ------   ------
  Native Heap     8517     8448        0       28    14848    10681     4166
  Dalvik Heap     2337     1652      616       11     4259     2130     2129
 Dalvik Other     2512     2512        0        0
        Stack      544      544        0        0
       Ashmem        2        0        0        0
    Other dev       16        0       16        0
     .so mmap    11080      920     8672       18
    .apk mmap     2524      248       84        0
    .ttf mmap       97        0       60        0
    .dex mmap     9592        8     7160        0
    .oat mmap       57        0       20        0
    .art mmap     6265     5116      696        0
   Other mmap       95        4       16        0
   EGL mtrack    10824    10824        0        0
      Unknown    23402    23400        0        1
        TOTAL    77922    53676    17340       58    19107    12811     6295

 App Summary
                       Pss(KB)
                        ------
           Java Heap:     7464
         Native Heap:     8448
                Code:    17172
               Stack:      544
            Graphics:    10824
       Private Other:    26564
              System:     6906

               TOTAL:    77922       TOTAL SWAP PSS:       58

 Objects
               Views:       58         ViewRootImpl:        1
         AppContexts:        5           Activities:        1
              Assets:        5        AssetManagers:        0
       Local Binders:       10        Proxy Binders:       31
       Parcel memory:        5         Parcel count:       23
    Death Recipients:        0      OpenSSL Sockets:        0
            WebViews:        0

 SQL
         MEMORY_USED:        0
  PAGECACHE_OVERFLOW:        0          MALLOC_SIZE:        0

`;

test("processRamOutput", () => {
  expect(processOutput(SAMPLE_OUTPUT)).toEqual(77.922);
});
