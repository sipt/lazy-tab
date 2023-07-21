import { useEffect, useState } from "react";

interface WindowProps {
  window: chrome.windows.Window;
  selectedIds: number[];
  refresh: boolean;
  channel: BroadcastChannel;
}

function Window(props: WindowProps) {
  const [width, setWidth] = useState(0);
  const [isCurrent, setIsCurrent] = useState(false); // props.window.focused
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [showCloseBtn, setShowCloseBtn] = useState(false);
  useEffect(() => {
    chrome.windows
      .getCurrent()
      .then((window) => {
        setIsCurrent(window.id === props.window.id);
      })
      .catch((err) => {
        console.log(err);
      });
    chrome.tabs
      .query({ windowId: props.window.id })
      .then((tabs) => {
        setWidth(getWidth(tabs));
        setTabs(tabs);
        console.log(tabs);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.refresh]);
  // useEffect(() => {}, [props.selectedIds]);
  return (
    <div className="shadow-xl min-h-36" style={{ width: `${width}px` }}>
      <div className="sm:rounded-lg ring-1 ring-slate-900/5">
        <div className="sm:rounded-t-xl bg-gradient-to-b from-white to-[#FBFBFB] dark:bg-none dark:bg-slate-700 dark:highlight-white/10">
          <div className="py-2.5 grid items-center px-4 gap-6">
            <div className="flex items-center">
              <div
                className={`flex w-2.5 h-2.5 rounded-full ${
                  isCurrent ? "bg-[#EC6A5F]" : "bg-slate-500"
                }`}
                onMouseEnter={() => {
                  setShowCloseBtn(true);
                }}
                onMouseLeave={() => {
                  setShowCloseBtn(false);
                }}
              >
                <button
                  className="w-2.5 h-2.5 rounded-full bg-[#EC6A5F] active:bg-[#fca5a5]"
                  hidden={!showCloseBtn}
                  onClick={() => {
                    props.channel.postMessage({
                      type: "close-window",
                      windowId: props.window.id,
                    });
                  }}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 14L34 34"
                      stroke="#475569"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14 34L34 14"
                      stroke="#475569"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div
                className={`ml-1.5 w-2.5 h-2.5 rounded-full ${
                  isCurrent ? "bg-[#F4BF50]" : "bg-slate-500"
                }`}
              ></div>
              <div
                className={`ml-1.5 w-2.5 h-2.5 rounded-full  ${
                  isCurrent ? "bg-[#61C454]" : "bg-slate-500"
                }`}
              ></div>
            </div>
          </div>
        </div>
        <div className="w-full select-none bg-slate-100 text-slate-400 flex items-center justify-center space-x-2 dark:bg-slate-900 dark:text-slate-500 rounded-b">
          <div className="w-full min-h-[100px] flex flex-wrap content-start gap-2 p-4">
            {tabs.map((tab, index) => {
              return (
                <div
                  key={index}
                  onMouseEnter={() => {
                    props.channel.postMessage({
                      type: "hover",
                      tab: tab,
                    });
                  }}
                  className={`flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow text-slate-900 text-sm font-bold hover:scale-125 transition ${
                    props.selectedIds && props.selectedIds.includes(tab.id!)
                      ? "scale-125 border border-indigo-600"
                      : ""
                  }`}
                >
                  <img
                    className="w-5 h-5"
                    src={tab.favIconUrl || "/favicon.ico"}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function getWidth(tabs: chrome.tabs.Tab[]) {
  const len = tabs.length;
  if (len === 0) return 100;
  var cols = 3;
  if (len > 12) {
    for (let i = 1; true; i++) {
      const r = Math.ceil(len / i);
      if (r <= i + 1) {
        cols = i;
        break;
      }
    }
  }
  const width = 16 * 2 + cols * 32 + (cols - 1) * 8;
  console.log(width);
  return Math.max(width, 100);
}

export default Window;
