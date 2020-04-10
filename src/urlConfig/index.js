// 根据环境来选择api地址
let baseUrl = window.location.hostname;
let API_URL = "";
let WS_URL = "";
switch (baseUrl) {
    case "localhost":
        API_URL = 'https://staging-table-api.huoxingy.com';
        WS_URL = "https://staging-ws.huoxingy.com/";
        break;
    case "staging-table-clerk.huoxingy.com":
        API_URL = 'https://staging-table-api.huoxingy.com';
        WS_URL = "https://staging-ws.huoxingy.com/";
        break;
    case "prod-test-table-clerk.huoxingy.com":
        API_URL = 'https://prod-test-table-api.huoxingy.com';
        WS_URL = "https://prod-test-ws.huoxingy.com/";
        break;
    default:
        API_URL = 'https://table-api.huoxingy.com';
        WS_URL = "https://prod-ws.huoxingy.com/";
        break;
}
//
// export const API_BASE_URL = API_URL;
// export const WS_API_URL = WS_URL;

export const BASE_URL = API_URL;
export const WS_API_URL =  WS_URL;
