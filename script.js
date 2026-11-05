//OpenWeatherMap APIのアクセスキーと、静岡市の緯度（34.9769）・経度（138.3831）を設定//
const WEATHER_API_KEY = "b6f83b3c70978dc418db7352e80c8989";
const SHIZUOKA_LAT = 34.9769;
const SHIZUOKA_LON = 138.3831;

//HTMLの読み込みが完了したタイミングで画面の各機能を初期起動//
document.addEventListener("DOMContentLoaded", () => {
    initClock();
    fetchWeather();
    fetchNews();
    updateTrainInfo();
    setInterval(updateTrainInfo, 10000); // 10秒ごとに電車案内を更新
});

//電車の発車時刻を保持するマスターデータです。//
const TRAIN_TIMETABLE = {
    // 上り（沼津・熱海方面）
    up: {
        weekday: [
            "05:12", "05:33", "05:52",
            "06:06", "06:21", "06:31", "06:41", "06:51", "06:59",
            "07:08", "07:15", "07:23", "07:31", "07:38", "07:47", "07:54",
            "08:02", "08:11", "08:20", "08:31", "08:42", "08:53",
            "09:06", "09:19", "09:31", "09:43", "09:56",
            "10:10", "10:24", "10:38", "10:52",
            "11:06", "11:20", "11:34", "11:48",
            "12:02", "12:16", "12:30", "12:44", "12:58",
            "13:12", "13:26", "13:40", "13:54",
            "14:08", "14:22", "14:36", "14:50",
            "15:04", "15:18", "15:30", "15:42", "15:54",
            "16:06", "16:18", "16:29", "16:40", "16:51",
            "17:02", "17:13", "17:24", "17:35", "17:46", "17:57",
            "18:08", "18:19", "18:30", "18:41", "18:52",
            "19:03", "19:14", "19:25", "19:36", "19:48",
            "20:00", "20:13", "20:26", "20:40", "20:54",
            "21:08", "21:23", "21:38", "21:53",
            "22:09", "22:25", "22:42",
            "23:00", "23:20", "23:41"
        ],
        holiday: [
            "05:12", "05:33", "05:52",
            "06:06", "06:21", "06:38", "06:51",
            "07:03", "07:15", "07:28", "07:38", "07:50",
            "08:02", "08:14", "08:26", "08:38", "08:50",
            "09:02", "09:14", "09:26", "09:38", "09:50",
            "10:02", "10:16", "10:30", "10:44", "10:58",
            "11:12", "11:26", "11:40", "11:54",
            "12:08", "12:22", "12:36", "12:50",
            "13:04", "13:18", "13:32", "13:46",
            "14:00", "14:14", "14:28", "14:42", "14:56",
            "15:10", "15:24", "15:38", "15:50",
            "16:02", "16:14", "16:26", "16:38", "16:50",
            "17:02", "17:14", "17:26", "17:38", "17:50",
            "18:02", "18:14", "18:26", "18:38", "18:50",
            "19:02", "19:14", "19:26", "19:38", "19:50",
            "20:02", "20:15", "20:29", "20:43", "20:57",
            "21:12", "21:27", "21:42", "21:57",
            "22:12", "22:28", "22:44",
            "23:01", "23:21", "23:41"
        ]
    },
    // 下り（静岡・浜松方面）
    down: {
        weekday: [
            "05:38", "05:54",
            "06:08", "06:20", "06:31", "06:41", "06:50", "06:58",
            "07:06", "07:14", "07:21", "07:29", "07:36", "07:44", "07:52",
            "08:00", "08:08", "08:17", "08:26", "08:36", "08:47", "08:58",
            "09:10", "09:22", "09:34", "09:46", "09:58",
            "10:12", "10:26", "10:40", "10:54",
            "11:08", "11:22", "11:36", "11:50",
            "12:04", "12:18", "12:32", "12:46",
            "13:00", "13:14", "13:28", "13:42", "13:56",
            "14:10", "14:24", "14:38", "14:52",
            "15:06", "15:18", "15:30", "15:42", "15:54",
            "16:05", "16:16", "16:27", "16:38", "16:49",
            "17:00", "17:11", "17:22", "17:33", "17:44", "17:55",
            "18:06", "18:17", "18:28", "18:39", "18:50",
            "19:01", "19:12", "19:23", "19:34", "19:46", "19:58",
            "20:11", "20:25", "20:39", "20:53",
            "21:08", "21:23", "21:38", "21:53",
            "22:09", "22:25", "22:42",
            "23:01", "23:23", "23:48"
        ],
        holiday: [
            "05:38", "05:54",
            "06:08", "06:22", "06:36", "06:50",
            "07:02", "07:14", "07:26", "07:38", "07:50",
            "08:02", "08:14", "08:26", "08:38", "08:50",
            "09:02", "09:14", "09:26", "09:38", "09:50",
            "10:02", "10:16", "10:30", "10:44", "10:58",
            "11:12", "11:26", "11:40", "11:54",
            "12:08", "12:22", "12:36", "12:50",
            "13:04", "13:18", "13:32", "13:46",
            "14:00", "14:14", "14:28", "14:42", "14:56",
            "15:10", "15:24", "15:38", "15:50",
            "16:02", "16:14", "16:26", "16:38", "16:50",
            "17:02", "17:14", "17:26", "17:38", "17:50",
            "18:02", "18:14", "18:26", "18:38", "18:50",
            "19:02", "19:14", "19:26", "19:38", "19:50",
            "20:02", "20:15", "20:29", "20:43", "20:57",
            "21:12", "21:27", "21:42", "21:57",
            "22:12", "22:28", "22:44",
            "23:01", "23:23", "23:48"
        ]
    }
};



// タブ切り替え機能 画面の表示セクションを切り替える UI 用の関数//
//天気・電車・時計・ニュースの4つのエリアを一旦すべて非表示 (display = "none") にします。
//引数 tabName（"weather", "train", "clock", "news"）に応じて、指定されたセクションだけを表示 (display = "block") に切り替える//
function switchTab(tabName) {
    const weatherSection = document.querySelector(".weather-info");
    const trainSection = document.querySelector(".train-info");
    const clockSection = document.querySelector(".clock-info");
    const newsSection = document.querySelector(".news-info");

    if (!weatherSection || !trainSection || !clockSection || !newsSection) return;

    weatherSection.style.display = "none";
    trainSection.style.display = "none";
    clockSection.style.display = "none";
    newsSection.style.display = "none";

    if (tabName === "weather") weatherSection.style.display = "block";
    if (tabName === "train") trainSection.style.display = "block";
    if (tabName === "clock") clockSection.style.display = "block";
    if (tabName === "news") newsSection.style.display = "block";
}


// 2. リアルタイム時計＆日付機能 //
//画面上の日付と現在時刻を毎秒更新してリアルタイム表示します。//
//setInterval(updateTime, 1000) により、1秒周期で自動実行//
function initClock() {
    const dayOfWeekStr = ["日", "月", "火", "水", "木", "金", "土"];

    function updateTime() {
        const now = new Date();

        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const dayStr = dayOfWeekStr[now.getDay()];
        const fullDateString = `${year}年${month}月${date}日（${dayStr}）`;

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        const timeString = `${hours}:${minutes}`;
        const secondsString = `${seconds}秒`;
        const fullTimeString = `${hours}:${minutes}:${seconds}`;

        const dateDisplay = document.getElementById("date-display");
        const clockDisplay = document.getElementById("clock-display");
        if (dateDisplay) dateDisplay.textContent = fullDateString;
        if (clockDisplay) clockDisplay.textContent = fullTimeString;

        const navClock = document.getElementById("current-time");
        const navSeconds = document.getElementById("current-seconds");
        if (navClock) navClock.textContent = timeString;
        if (navSeconds) navSeconds.textContent = secondsString;
    }

    updateTime();
    setInterval(updateTime, 1000);
}

// 3. 天気API（現在の天気 ＋ 5時間帯予報） //
//fetchWeather() 役割: OpenWeatherMap API から「現在の天気と気温」を取得//
async function fetchWeather() {
    const ondoElem = document.getElementById("ondo");
    const tenkiElem = document.getElementById("tenki");
    const gazouContainer = document.querySelector(".gazou");
    const navTemp = document.getElementById("nav-weather-temp");
    const navDesc = document.getElementById("nav-weather-desc");

    //APIエラー時やネットワーク不通時は setFallbackData() が働き、ダミーデータ（20℃・晴れ）を表示//
    const setFallbackData = () => {
        if (ondoElem) ondoElem.textContent = "気温: 20℃";
        if (tenkiElem) tenkiElem.textContent = "天気: 晴れ";
        if (gazouContainer) gazouContainer.innerHTML = '<span style="font-size: 3rem;">☀️</span>';
        if (navTemp) navTemp.textContent = "20℃";
        if (navDesc) navDesc.textContent = "晴れ";
        renderFallbackHourly();
    };

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${SHIZUOKA_LAT}&lon=${SHIZUOKA_LON}&units=metric&lang=ja&appid=${WEATHER_API_KEY}`;

    try {
        const response = await fetch(currentUrl);
        if (!response.ok) throw new Error();
        const data = await response.json();

        const temp = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;

        if (ondoElem) ondoElem.textContent = `気温: ${temp}℃`;
        if (tenkiElem) tenkiElem.textContent = `天気: ${description}`;
        if (gazouContainer) {
            gazouContainer.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}">`;
        }

        if (navTemp) navTemp.textContent = `${temp}℃`;
        if (navDesc) navDesc.textContent = description;

        fetchHourlyForecast();
    } catch (error) {
        console.error("天気エラー:", error);
        setFallbackData();
    }
}

//fetchHourlyForecast() 役割: OpenWeatherMap の5日間/3時間ごとの予報APIから、直近5時間分の予報を取得//
async function fetchHourlyForecast() {
    const hourlyContainer = document.getElementById("hourly-forecast");
    if (!hourlyContainer) return;

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${SHIZUOKA_LAT}&lon=${SHIZUOKA_LON}&units=metric&lang=ja&appid=${WEATHER_API_KEY}`;

    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) throw new Error();
        const data = await response.json();

        const list5 = data.list.slice(0, 5);
        const html = list5.map(item => {
            const timeStr = item.dt_txt.split(" ")[1].substring(0, 5);
            const temp = Math.round(item.main.temp);
            const desc = item.weather[0].description;
            const icon = item.weather[0].icon;

            return `
                <div class="hourly-card">
                    <div class="hourly-time">${timeStr}</div>
                    <div class="hourly-icon">
                        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}">
                    </div>
                    <div class="hourly-temp">${temp}℃</div>
                    <div class="hourly-desc">${desc}</div>
                </div>
            `;
        }).join("");

        hourlyContainer.innerHTML = html;
    } catch (error) {
        renderFallbackHourly();
    }
}

function renderFallbackHourly() {
    const hourlyContainer = document.getElementById("hourly-forecast");
    if (!hourlyContainer) return;

    const dummyData = [
        { time: "15:00", temp: "21℃", desc: "晴れ", icon: "☀️" },
        { time: "18:00", temp: "18℃", desc: "晴れ", icon: "🌙" },
        { time: "21:00", temp: "16℃", desc: "曇り", icon: "☁️" },
        { time: "00:00", temp: "14℃", desc: "曇り", icon: "☁️" },
        { time: "03:00", temp: "13℃", desc: "雨", icon: "🌧️" }
    ];

    hourlyContainer.innerHTML = dummyData.map(item => `
        <div class="hourly-card">
            <div class="hourly-time">${item.time}</div>
            <div class="hourly-icon" style="font-size: 1.5rem; line-height: 40px;">${item.icon}</div>
            <div class="hourly-temp">${item.temp}</div>
            <div class="hourly-desc">${item.desc}</div>
        </div>
    `).join("");
}

//ニュースAPI（安定プロキシ経由でYahoo!ニュースを取得）主要トピックスのRSSを取得し、画面に表示する//
async function fetchNews() {
    const newsContainer = document.getElementById("news");
    const navNewsHead = document.getElementById("nav-news-head");

    const rssUrl = "https://news.yahoo.co.jp/rss/topics/top-picks.xml";
    const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error();
        const data = await response.json();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        const items = xmlDoc.querySelectorAll("item");

        if (items.length > 0) {
            let newsListHtml = "";
            let firstNewsTitle = "";

            items.forEach((item, index) => {
                if (index < 5) {
                    const title = item.querySelector("title") ? item.querySelector("title").textContent : "";
                    const link = item.querySelector("link") ? item.querySelector("link").textContent : "#";

                    if (index === 0) firstNewsTitle = title;

                    newsListHtml += `
                        <div class="news-item">
                            <a href="${link}" target="_blank" rel="noopener noreferrer">
                                ${title}
                            </a>
                        </div>
                    `;
                }
            });

            if (newsContainer) newsContainer.innerHTML = newsListHtml;
            if (navNewsHead) navNewsHead.textContent = firstNewsTitle;
        } else {
            throw new Error();
        }
    } catch (error) {
        console.error("ニュース取得エラー:", error);
        if (newsContainer) {
            newsContainer.innerHTML = `
                <div class="news-item"><a href="https://news.yahoo.co.jp" target="_blank">Yahoo!ニュース 主要トピックス</a></div>
            `;
        }
        if (navNewsHead) navNewsHead.textContent = "最新ニュース（Yahoo!）";
    }
}

//updateTrainInfo() 役割: 現在時刻に基づき、次の電車の発車時刻を計算し、画面に表示する//
function updateTrainInfo() {
    const now = new Date();
    const isWeekend = (now.getDay() === 0 || now.getDay() === 6);
    const scheduleType = isWeekend ? "holiday" : "weekday";
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const getNextTrain = (list) => {
        for (let timeStr of list) {
            const [h, m] = timeStr.split(":").map(Number);
            const trainMinutes = h * 60 + m;
            if (trainMinutes >= currentMinutes) {
                const diff = trainMinutes - currentMinutes;
                return { time: timeStr, diff: diff };
            }
        }
        return null;
    };

    const nextUp = getNextTrain(TRAIN_TIMETABLE.up[scheduleType]);
    const nextDown = getNextTrain(TRAIN_TIMETABLE.down[scheduleType]);

    const jikokuElem = document.getElementById("jikoku");
    const jikoku2Elem = document.getElementById("jikoku2");

    if (jikokuElem) {
        if (nextUp) {
            jikokuElem.innerHTML = `<strong>上り (沼津方面):</strong> ${nextUp.time} 発 <span style="color:#e65100; font-weight:bold;">(あと ${nextUp.diff}分)</span>`;
        } else {
            jikokuElem.textContent = "上り (沼津方面): 本日の運行は終了しました";
        }
    }

    if (jikoku2Elem) {
        if (nextDown) {
            jikoku2Elem.innerHTML = `<strong>下り (静岡方面):</strong> ${nextDown.time} 発 <span style="color:#e65100; font-weight:bold;">(あと ${nextDown.diff}分)</span>`;
        } else {
            jikoku2Elem.textContent = "下り (静岡方面): 本日の運行は終了しました";
        }
    }

    const navTrainNext = document.getElementById("nav-train-next");
    const navTrainDest = document.getElementById("nav-train-dest");

    if (navTrainNext && navTrainDest) {
        if (nextDown) {
            navTrainNext.textContent = nextDown.time;
            navTrainDest.textContent = `静岡行 (あと${nextDown.diff}分)`;
        } else if (nextUp) {
            navTrainNext.textContent = nextUp.time;
            navTrainDest.textContent = `沼津行 (あと${nextUp.diff}分)`;
        } else {
            navTrainNext.textContent = "--:--";
            navTrainDest.textContent = "運行終了";
        }
    }
}
