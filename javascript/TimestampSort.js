var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Misc
var HotV = "V-1.0"; // the version of H.o.t
// Get these from Files in the furture
var TimestampTxt = document.getElementById("TimestampTxt");
var PKey = document.getElementById("TwitchKey");
var PClip = document.getElementById("ClipOffset");
var PLogin = document.getElementById("TwitchLogin");
var Plocal = document.getElementById("Local");
// Settings
var RawTxt;
var AppAcessToken;
var Clipoffset;
var StreamerName;
var SettingsLocal;
if (TimestampTxt != null) {
    RawTxt = TimestampTxt.innerHTML;
}
else {
    console.log("Your Timestamp.Txt was not found!, check if the filepath is correct or if it doesnt have data in it!");
}
if (PKey != null) {
    AppAcessToken = PKey.innerHTML;
}
else {
    console.log("H.O.T could not get your TwitchKey, you will not be able to use Clip-Stamps");
    var TwitchClipbtn = document.getElementById("TwitchClip");
    TwitchClipbtn.disabled = true;
}
if (PClip != null) {
    Clipoffset = parseInt(PClip.innerHTML); // twitch default
}
else {
    console.log("you didnt set a ClipOffset, H.O.T has defaulted to 26 seconds of offset.");
    Clipoffset = 26;
}
if (PLogin != null) {
    StreamerName = PLogin.innerHTML;
}
else {
    console.log("you didnt set a TwitchLoginName, you will not be able to use Clip-Stamps");
    var TwitchClipbtn = document.getElementById("TwitchClip");
    TwitchClipbtn.disabled = true;
}
if (Plocal != null) {
    SettingsLocal = Plocal.innerHTML;
}
else {
    console.log("LocalSettings not found Turning off Local Mode");
    SettingsLocal = "";
}
// Asigned later
var AclientId = "";
var TwitchConnected = false; // tells if the Twitch HTTP calls should be called or not.
var MultiDimStreamArr = Array(); // Holds Raw Data from txt
var MultiDimRecordArr = Array(); // Holds Raw Data from txt
var StreamDatesArr = Array(); // Holds data for when a stream was streamed
var RecordDatesArr = Array(); // Holds data for when a Recording was recorded
var DescArrS = new Array(); // holds all the Finished Stream descriptions
var LocalDescArrS = new Array();
var DescArrR = new Array(); // holds all the Finished Recording descriptions
var LocalDescArrR = new Array();
var StreamDatesRaw = new Array();
//#region Token Validation.
validateToken();
//#endregion
//#region Basic Setup H.O.T NON Twitch API
if (RawTxt != undefined && RawTxt != "" && RawTxt != null) {
    if (CutOuts(RawTxt) == 1) {
        // Runs CutOuts and if successful run next Method in line
        if (SetOps(MultiDimStreamArr, MultiDimRecordArr)) {
            // Runs SetOps if sucessful run next Method in line
            // Set in Data to Webpage
            var statsP = document.getElementById("Stats");
            statsP.innerHTML = "\u2022 Found ".concat(MultiDimStreamArr.length, " Streams, and ").concat(MultiDimRecordArr.length, " Recordings");
            if (DomSet() == 1) {
                // Domset needs to be ran before we call ValidateToken();
            }
            else {
                // Error logging
                console.log("Failed Placing Things in the Websites");
            }
        }
        else {
            console.log("Error Creating Description");
        }
    }
    else {
        console.log("Error Sorting Timestamps");
    }
}
//#endregion
// Twitch handling
// Event handlers
// Twitch Clip Needs A Big Clean up.
//#region TwitchClip gets twitch clips for your description when clicked
var TwitchClip = document.getElementById("TwitchClip");
TwitchClip.addEventListener("click", function (event) {
    return __awaiter(this, void 0, void 0, function () {
        var UserIdResp, AcorBtns, StreamedDate, index, index, Timestamps, VODcount, UserVods, index, StreamsStreamed, res, MultidimClipResps, _a, TimestampTwitch, TimeTwitch, LocalSceneShift, LocalSceneTime, LocalSceneShifttemp, LocalSceneTimetemp, V, res_1, i, Timestamp, R, i, Timestamps_1, StreamDate, ClipDates, TimestampArr, TimeArr, SortTime, q, res_2, Timestamps, t, T, TestHour, Timestamp, CompleteTimestampArr, Pie, Reg, u;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(TwitchConnected == true)) return [3 /*break*/, 8];
                    return [4 /*yield*/, HttpCalling("https://api.twitch.tv/helix/users?login=".concat(StreamerName))];
                case 1:
                    UserIdResp = _b.sent();
                    AcorBtns = Array();
                    StreamedDate = Array();
                    // getting acordbuttons & local timestamps.
                    for (index = 0; index < StreamDatesArr.length; index++) {
                        AcorBtns.push(document.getElementById("AcordBtn-".concat(index)));
                    }
                    for (index = 0; index < AcorBtns.length; index++) {
                        Timestamps = AcorBtns[index].innerHTML.split(" ");
                        StreamedDate.push(Timestamps[5]);
                    }
                    VODcount = 0;
                    return [4 /*yield*/, HttpCalling("https://api.twitch.tv/helix/videos?user_id=".concat(UserIdResp["data"][0]["id"]))];
                case 2:
                    UserVods = (_b.sent());
                    // counting VODs
                    for (index = 0; index < UserVods["data"].length; index++) {
                        if (UserVods["data"][index]["type"] != "highlight") {
                            VODcount++;
                        }
                    }
                    StreamsStreamed = 0;
                    _b.label = 3;
                case 3:
                    if (!(StreamsStreamed < StreamedDate.length)) return [3 /*break*/, 7];
                    if (!(VODcount != 0 || VODcount != null)) return [3 /*break*/, 5];
                    res = AcorBtns[StreamsStreamed].innerHTML.split(" ");
                    _a = SortClips;
                    return [4 /*yield*/, GetClipsFromDate(res[5], UserIdResp["data"][0]["id"])];
                case 4:
                    MultidimClipResps = _a.apply(void 0, [_b.sent(), false]);
                    console.log(MultidimClipResps);
                    TimestampTwitch = Array();
                    TimeTwitch = Array();
                    LocalSceneShift = Array();
                    LocalSceneTime = Array();
                    LocalSceneShifttemp = Array();
                    LocalSceneTimetemp = Array();
                    for (V = 0; V < MultiDimStreamArr[StreamsStreamed].length; V++) {
                        res_1 = MultiDimStreamArr[V];
                        if (res_1 == undefined) {
                            // for some reason keeps running into indexes it doesnt have? this fixes it but MAyyyy be not the best fix
                            continue;
                        }
                        else {
                            for (i = 0; i < res_1.length; i++) {
                                Timestamp = res_1[i];
                                if (Timestamp.match(/▸.*/i)) {
                                    LocalSceneShift.push(Timestamp);
                                    R = Timestamp.split(" ");
                                    LocalSceneTime.push(R[1]);
                                }
                            }
                            LocalSceneShifttemp = LocalSceneShift;
                            LocalSceneTimetemp = LocalSceneTime;
                            LocalSceneShift = Array();
                            LocalSceneTime = Array();
                        }
                    }
                    // sets in Clip timestamp.
                    //console.log(MultidimClipResps);
                    if (MultidimClipResps[0]["vod_offset"] != null &&
                        MultidimClipResps[0]["vod_offset"] != "null") {
                        for (i = 0; i < MultidimClipResps[StreamsStreamed].length; i++) {
                            // gives a timestamp close to LOCAL timestamp from Twitch API.
                            TimestampTwitch.push("• " +
                                SectoTimestamp(MultidimClipResps[i]["vod_offset"]) +
                                " " +
                                MultidimClipResps[i]["title"]);
                            TimeTwitch.push(MultidimClipResps[i]["vod_offset"]);
                        }
                    }
                    else {
                        Timestamps_1 = AcorBtns[StreamsStreamed].innerHTML.split(" ");
                        StreamDate = new Date(Timestamps_1[5][0] +
                            Timestamps_1[5][1] +
                            Timestamps_1[5][2] +
                            Timestamps_1[5][3], Timestamps_1[5][5] + Timestamps_1[5][6], Timestamps_1[5][8] + Timestamps_1[5][9], Timestamps_1[6][0] + Timestamps_1[6][1], Timestamps_1[6][3] + Timestamps_1[6][4], Timestamps_1[6][6] + Timestamps_1[6][7]);
                        ClipDates = SortClips(MultidimClipResps, true);
                        //console.log(ClipDates);
                    }
                    TimestampArr = Array();
                    TimeArr = Array();
                    TimestampArr = LocalSceneShifttemp.concat(TimestampTwitch);
                    TimeArr = LocalSceneTimetemp.concat(TimeTwitch);
                    SortTime = Array();
                    for (q = 0; q < TimestampArr.length; q++) {
                        res_2 = TimestampArr[q].split(" ");
                        SortTime.push(TimestampToDate(res_2[1]));
                    }
                    SortTime.sort();
                    Timestamps = Array();
                    //#region Sorted Dates get turned into timestamps again.
                    for (t = 0; t < SortTime.length; t++) {
                        T = SortTime[t].toString().split(" ");
                        TestHour = T[4].split(":");
                        Timestamp = void 0;
                        if (TestHour[0][0] == "0") {
                            Timestamp = to2Time(T[4].substring(1)); // skips >0<0:20:40 of the timestamp
                            Timestamps.push(Timestamp);
                        }
                        else {
                            // keeps extra hour placement for 24 hour timestamps.
                            Timestamp = to2Time(T[4]);
                            Timestamps.push(Timestamp);
                        }
                    }
                    CompleteTimestampArr = Array();
                    //#region finding the correct indexs for titles and completing the sorting
                    // for each til we find the correct index
                    for (Pie = 0; Pie < Timestamps.length; Pie++) {
                        Reg = new RegExp(Timestamps[Pie] + ".*");
                        for (u = 0; u < TimestampArr.length; u++) {
                            if (TimestampArr[u].match(Reg)) {
                                CompleteTimestampArr.push(TimestampArr[u]);
                                break;
                            }
                        }
                    }
                    //#endregion
                    try {
                        // Creates both a local (if enabled) and normal description and replaces the correct index of description.
                        DescriptionReplace(CompleteTimestampArr, StreamsStreamed);
                    }
                    catch (error) {
                        console.error();
                    }
                    // change Acord button titles.
                    ChangeAcordButtonNames(MultidimClipResps, StreamsStreamed, AcorBtns);
                    return [3 /*break*/, 6];
                case 5:
                    // Found No Vods to get names from.
                    // Getting clips without a VOD
                    console.log("Getting clips for streams without VODs");
                    _b.label = 6;
                case 6:
                    StreamsStreamed++;
                    return [3 /*break*/, 3];
                case 7: return [3 /*break*/, 9];
                case 8:
                    console.log("Failed to Validate Token Try Again");
                    validateToken();
                    _b.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
});
function DescriptionReplace(TimestampsArr, Index) {
    return __awaiter(this, void 0, void 0, function () {
        var Desc, NewDesc, LNewDesc, res, res1, res2, res3, BeforeDescL, AfterDescL, BeforeDesc, AfterDesc, resArray, i, timestamp, res, res1, BeforeDesc, AfterDesc, resArray, i, timestamp;
        return __generator(this, function (_a) {
            Desc = document.getElementsByClassName("Charcounts");
            NewDesc = "";
            LNewDesc = "";
            if (SettingsLocal != false && SettingsLocal != "false") {
                res = document.getElementById("LocalBeforeDesc");
                res1 = document.getElementById("LocalAfterDesc");
                res2 = document.getElementById("BeforeDesc");
                res3 = document.getElementById("AfterDesc");
                BeforeDescL = res.innerHTML;
                AfterDescL = res1.innerHTML;
                BeforeDesc = res2.innerHTML;
                AfterDesc = res3.innerHTML;
                resArray = TimestampsArr;
                LNewDesc = BeforeDescL + "\n\n";
                LNewDesc = LNewDesc + "Hotkey, Operated, Time-stamper (H.O.T) ".concat(HotV, "\n");
                NewDesc = BeforeDesc + "\n\n";
                NewDesc = NewDesc + "Hotkey, Operated, Time-stamper (H.O.T) ".concat(HotV, "\n");
                for (i = 0; i < resArray.length; i++) {
                    timestamp = resArray[i];
                    LNewDesc = LNewDesc + timestamp + "\n";
                    NewDesc = NewDesc + timestamp + "\n";
                }
                LNewDesc = LNewDesc + "\n" + AfterDescL;
                NewDesc = NewDesc + "\n" + AfterDesc;
                Desc[Index].innerHTML = NewDesc;
                Desc[Index + 1].innerHTML = LNewDesc;
                LNewDesc = "";
                NewDesc = "";
            }
            else {
                res = document.getElementById("BeforeDesc");
                res1 = document.getElementById("AfterDesc");
                BeforeDesc = res.innerHTML;
                AfterDesc = res1.innerHTML;
                resArray = TimestampsArr;
                NewDesc = BeforeDesc + "\n\n";
                NewDesc = NewDesc + "Hotkey, Operated, Time-stamper (H.O.T) ".concat(HotV, "\n");
                for (i = 0; i < resArray.length; i++) {
                    timestamp = resArray[i];
                    NewDesc = NewDesc + timestamp + "\n";
                }
                NewDesc = NewDesc + "\n" + AfterDesc;
                Desc[Index].innerHTML = NewDesc;
                NewDesc = "";
            }
            return [2 /*return*/];
        });
    });
}
//#endregion
//#endregion
// Large Functions
//#region CutOuts: Function Removes NonUsefull data from RawTxt Data
// makes a Clean Version Timestamp version from the Raw txt
// Input : A Timestamp Txt Made by the StreamReader Plugin for OBS:
// Outputs: Sets Data in Multidim-Stream/RecordArr with a clean set of Timestamps -
// returns 1 if sucessful and 0 if failed
//- with Scenes marked with their names and Clips marked
function CutOuts(RawTxt) {
    var RawTxtArr = RawTxt.split("\n"); // splits them by Spaces : EVENT:START, RECORDING, @, etc...
    var StreamArr = Array();
    var RecordArr = Array();
    var Catch = false; // catch is activated when nearing the end of the VOD/Stream. it tells it to stop/catch the varibles for now and place it in the arrays
    var LineScene = "";
    // maybe remove ClipNo later
    var ClipNo = 0;
    var xs = 0; // x Stream
    var xr = 0; // x Recording
    for (var index = 0; index < RawTxtArr.length; index++) {
        var Word = RawTxtArr[index]; // effectively a Foreach loop but without javascripts weird foreach loops
        if (Word.match(/EVENT:START.*/i)) {
            if (Word.match(/.*Record.*/i)) {
                var resarr = Word.split(" ");
                RecordDatesArr.push(resarr[3] + " " + resarr[4]);
            }
            else if (Word.match(/.*Stream.*/i)) {
                var resarr = Word.split(" ");
                StreamDatesArr.push(resarr[3] + " " + resarr[4]);
            }
            continue;
        }
        if (Word.match(/EVENT:STOP.*/i)) {
            //console.log("In Event Stop: " + Word); // enters
            // add what ever array into multidim array
            if (typeof StreamArr !== "undefined") {
                if (StreamArr.length != 0) {
                    StreamArr.unshift("▸ 0:00 Start");
                    MultiDimStreamArr[xs] = StreamArr;
                    xs++;
                }
            }
            if (typeof RecordArr !== "undefined") {
                if (RecordArr.length != 0) {
                    RecordArr.unshift("▸ 0:00 Start");
                    MultiDimRecordArr[xr] = RecordArr;
                    xr++;
                }
            }
            StreamArr = []; // clear array for new rerun
            RecordArr = []; // clear array for new rerun
            ClipNo = 0; // resets clip counter
            continue;
        }
        if (Word.match(/EVENT:SCENE.*/i)) {
            var resarr = Word.split(" ");
            LineScene = resarr[3]; // BRB, PLAYING, OUTRO, etc
            Catch = true; // marks next Record & Stream timestamp as a Scene Timestamp
            continue;
        }
        if (Catch == true) {
            if (to2Time(Word) != "0:00") {
                // if empty
                if (Word.match(/\d:\d\d:\d\d\s.*/i)) {
                    // if its a timestamp
                    if (Word.match(/.*Record.*/i)) {
                        // if "Record" is in the timestamp
                        var Timestamp = "▸ " + to2Time(Word) + " " + LineScene;
                        RecordArr.push(Timestamp); // should place this at the end of the array
                    }
                    if (Word.match(/.*Stream.*/i)) {
                        var Timestamp = "▸ " + to2Time(Word) + " " + LineScene;
                        StreamArr.push(Timestamp); // should place this at the end of the array
                        Catch = false;
                    }
                    continue;
                }
            }
        }
        else if (Word.search(/0:00:00.*/i) != 0) {
            //console.log("word passed 0:00:00 test:"+ Word);
            if (Word.match(/.*Record.*/i)) {
                var Timestamp = "• " + to2Time(AddClipDelay(Word, Clipoffset)) + " [ClipNo".concat(ClipNo, "]");
                ClipNo++;
                RecordArr.push(Timestamp);
            }
            if (Word.match(/.*Stream.*/i)) {
                // 7:58:58 Stream Time Marker
                var Timestamp = "• " + to2Time(AddClipDelay(Word, Clipoffset)) + " [ClipNo".concat(ClipNo, "]");
                ClipNo++;
                StreamArr.push(Timestamp);
            }
            else {
                continue;
            }
        }
    }
    // test if success
    if (typeof MultiDimStreamArr != "undefined" &&
        MultiDimStreamArr != null &&
        MultiDimStreamArr.length != null &&
        MultiDimStreamArr.length > 0) {
        return 1; // success
    }
    else if (typeof MultiDimRecordArr != "undefined" &&
        MultiDimRecordArr != null &&
        MultiDimRecordArr.length != null &&
        MultiDimRecordArr.length > 0) {
        return 1; // success
    }
    else {
        return 0; // Error
    }
}
//#endregion
//#region SetOps: Function Sorts the clean timestamps into a description
// Makes: a Description from PHP Txts and clean timestamps
// Input : Clean timestamps made by CutOuts()
// Outputs: a Finished Description only missing Clip names
// returns 1 if sucessful and 0 if failed
function SetOps(MultiDimStreamArr, MultiDimRecordArr) {
    // Set in All the timestamps correctly
    // Getting More Txts from PHP and ./Texts
    var res = document.getElementById("BeforeDesc");
    var res1 = document.getElementById("AfterDesc");
    var res2 = document.getElementById("LocalBeforeDesc");
    var res3 = document.getElementById("LocalAfterDesc");
    var BeforeDesc = res.innerHTML;
    var AfterDesc = res1.innerHTML;
    var LocalBeforeDesc;
    var LocalAfterDesc;
    var success = false;
    var Description = ""; // Finished Description Var
    var LocalDescript = ""; // finished description in another language
    // Makes a Working Description
    // If Not Null
    if (MultiDimStreamArr.length > -1) {
        // if has Values
        for (var index = 0; index < MultiDimStreamArr.length; index++) {
            var resArray = MultiDimStreamArr[index];
            if (SettingsLocal != "") {
                LocalBeforeDesc = res2.innerHTML;
                LocalAfterDesc = res3.innerHTML;
                LocalDescript = LocalBeforeDesc + "\n\n";
                LocalDescript =
                    LocalDescript +
                        "Hotkey, Operated, Time-stamper (H.O.T) ".concat(HotV, " \n(Clips are Offset by -").concat(Clipoffset, ")\n");
                for (var i = 0; i < resArray.length; i++) {
                    var timestamp = resArray[i];
                    LocalDescript = LocalDescript + timestamp + "\n";
                }
                LocalDescript = LocalDescript + "\n" + LocalAfterDesc;
                LocalDescArrS.push(LocalDescript);
                LocalDescript = "";
            }
            Description = BeforeDesc + "\n\n";
            Description =
                Description +
                    "Hotkey, Operated, Time-stamper (H.O.T) ".concat(HotV, " \n(Clips are Offset by -").concat(Clipoffset, ")\n");
            for (var i = 0; i < resArray.length; i++) {
                var timestamp = resArray[i];
                Description = Description + timestamp + "\n";
            }
            Description = Description + "\n" + AfterDesc;
            DescArrS.push(Description);
            Description = "";
        }
        success = true;
    }
    if (MultiDimRecordArr.length > -1) {
        // if has Values
        for (var index = 0; index < MultiDimRecordArr.length; index++) {
            var resArray = MultiDimRecordArr[index];
            if (SettingsLocal != "") {
                LocalBeforeDesc = res2.innerHTML;
                LocalAfterDesc = res3.innerHTML;
                LocalDescript = LocalBeforeDesc + "\n\n";
                LocalDescript =
                    LocalDescript + "Hotkey, Operated, Time-stamper (H.O.T) ".concat(HotV, "\n");
                for (var i = 0; i < resArray.length; i++) {
                    var timestamp = resArray[i];
                    LocalDescript = LocalDescript + timestamp + "\n";
                }
                LocalDescript = LocalDescript + "\n" + LocalAfterDesc;
                LocalDescArrR.push(LocalDescript);
                LocalDescript = "";
            }
            Description = BeforeDesc + "\n\n";
            Description =
                Description + "Hotkey, Operated, Time-stamper (H.O.T) ".concat(HotV, "\n");
            for (var i = 0; i < resArray.length; i++) {
                var timestamp = resArray[i];
                Description = Description + timestamp + "\n";
            }
            Description = Description + "\n" + AfterDesc;
            DescArrR.push(Description);
            Description = "";
        }
        success = true;
    }
    if (success == true) {
        return 1;
    }
    else {
        // error message
        console.log("Both Stream and Recording Arrays returned Nothing.");
        return 0;
    }
}
//#endregion
//#region DomSet: Sorts Arrays and Calls SetIns() also sorts data and makes Sidebar content on the webpage
// makes: The sidebar content,
// Input: Nothing
// Outputs: a Working side bar, also calls SetIns()
// returns Nothing
function DomSet() {
    DescArrS.reverse(); // makes array be Newest First
    DescArrR.reverse();
    LocalDescArrS.reverse();
    LocalDescArrR.reverse();
    StreamDatesArr.reverse();
    RecordDatesArr.reverse();
    // Update Sidebar
    var SidebarDiv = document.getElementById("SideBar");
    var nav = document.createElement("nav");
    var ul = document.createElement("ul");
    if (DescArrS.length > 0) {
        var liSeparate = document.createElement("li");
        var aSeprate = document.createElement("a");
        aSeprate.classList.add("nav-link", "text-center");
        aSeprate.setAttribute("href", "#Stream");
        aSeprate.innerHTML = "# Streams";
        liSeparate.classList.add("RecordStreamli", "rounded");
        liSeparate.append(aSeprate);
        ul.append(liSeparate);
        for (var index = 0; index < DescArrS.length; index++) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.innerHTML = "> - Stream - ".concat(index + 1);
            a.setAttribute("href", "#Stream-".concat(index));
            a.classList.add("nav-link", "text-center");
            li.classList.add("rounded");
            li.append(a);
            ul.append(li);
        }
        SetIns(DescArrS, StreamDatesArr, "Stream", "StreamingNo", LocalDescArrS, "LocaleDesc-", "streamtextarr", 0);
    }
    else if (DescArrS.length < 0) {
        console.log("No stream Timestamps found");
    }
    if (DescArrR.length > 0) {
        var liSeparate = document.createElement("li");
        var aSeprate = document.createElement("a");
        aSeprate.classList.add("nav-link", "text-center");
        aSeprate.setAttribute("href", "#Record");
        aSeprate.innerHTML = "# Recordings";
        liSeparate.classList.add("RecordStreamli", "rounded");
        liSeparate.append(aSeprate);
        ul.append(liSeparate);
        for (var index = 0; index < DescArrR.length; index++) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.innerHTML = "> - Record - ".concat(index + 1);
            a.setAttribute("href", "#Record-".concat(index));
            a.classList.add("nav-link", "text-center");
            li.classList.add("rounded");
            li.append(a);
            ul.append(li);
        }
        // If LocalMode is on it will double the amount of textareas and charcounters since now both a tranlated and original description is made!
        if (SettingsLocal == "") {
            SetIns(DescArrR, RecordDatesArr, "Record", "RecordingNo", LocalDescArrR, "recordLocalInput", "recordInput", DescArrS.length);
        }
        else {
            SetIns(DescArrR, RecordDatesArr, "Record", "RecordingNo", LocalDescArrR, "recordLocalInput", "recordInput", DescArrS.length * 2);
        }
    }
    else {
        console.log("No recording Timestamps found");
    }
    nav.append(ul);
    SidebarDiv.append(nav);
    return 1;
}
//#endregion
//#region SetIns: Function Takes Arrays and Sets them into the Webpage does not sort.
// makes: The Acordions for Streams or Recordings on the page by setting them in
// Input: A sorted Timestamp array, Date Array, and a String with the name of the array content.
// Outputs: Nothing, Void;
// returns Nothing
function SetIns(DescArr, DatesArr, string, IDname, LocalArr, LocalID, TextAreaID, CharCount_index) {
    var DescDiv = document.getElementById("DescriptionAreaDiv");
    for (var index = 0; index < DescArr.length; index++) {
        // Makes Vars for a bootstrap Accordion
        // Acord Div
        var AcordDiv = document.createElement("div");
        AcordDiv.classList.add("accordion", "mt-4");
        // Acord Item
        var AcordItem = document.createElement("div");
        AcordItem.classList.add("accordion-item");
        AcordItem.setAttribute("id", "".concat(string, "-").concat(index));
        // Acord Body
        var AcordBody = document.createElement("div");
        AcordBody.classList.add("accordion-body");
        // H2
        var h2 = document.createElement("h2");
        h2.classList.add("accordion-header");
        // Button for Acordion
        var button = document.createElement("button");
        button.classList.add("accordion-button", "btn", "collapsed");
        button.setAttribute("type", "button");
        button.setAttribute("data-bs-toggle", "collapse");
        button.setAttribute("data-bs-target", "#".concat(IDname + index));
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", "".concat(IDname + index));
        button.setAttribute("id", "AcordBtn-".concat(index));
        // Collapse Div
        var collapsedDiv = document.createElement("div");
        collapsedDiv.classList.add("accordion-collapse", "collapse");
        collapsedDiv.setAttribute("id", "".concat(IDname + index));
        collapsedDiv.setAttribute("data-bs-parent", "#accordion".concat(index));
        var CharDiv = document.createElement("div");
        CharDiv.classList.add("d-flex", "justify-content-between");
        var PNo = document.createElement("p");
        PNo.setAttribute("id", "CharCount".concat(CharCount_index));
        PNo.innerHTML = "CharCounter";
        var h3 = document.createElement("h3");
        h3.innerHTML = "# Suggested Description";
        // Text Area for Description
        var LocalTextarea = document.createElement("textarea");
        if (SettingsLocal != "") {
            LocalTextarea.classList.add("d-flex", "m-1", "res", "form-control", "Charcounts");
            LocalTextarea.innerHTML = LocalArr[index];
            LocalTextarea.setAttribute("id", "myLocalInput".concat(index));
        }
        var Textarea = document.createElement("textarea");
        Textarea.classList.add("d-flex", "m-1", "res", "form-control", "Textarea", "Charcounts");
        Textarea.innerHTML = DescArr[index];
        Textarea.setAttribute("id", "".concat(TextAreaID).concat(index));
        if (index % 2) {
            button.innerHTML =
                "<img class='imgIcon me-2' src='img\\Icons\\TimestampTXTIcon.png'> " +
                    "| " +
                    DatesArr[index] +
                    " - ".concat(string);
        }
        else {
            button.innerHTML =
                "<img class='imgIcon me-2' src='img\\Icons\\TimestampTXT2Icon.png'> " +
                    "| " +
                    DatesArr[index] +
                    " - ".concat(string);
        }
        // Select, Copy, Youtube Bar Vars
        // Buttons
        var ButtonDiv = document.createElement("div");
        var SelectBtn = document.createElement("button");
        var CopyBtn = document.createElement("button");
        var YoutubeBtn = document.createElement("button");
        ButtonDiv.classList.add("my-3");
        YoutubeBtn.innerHTML = "Update YT Vid";
        CopyBtn.innerHTML = "Copy Text";
        SelectBtn.innerHTML = "Select Text";
        SelectBtn.classList.add("btn", "mx-1", "Select", "button");
        CopyBtn.classList.add("btn", "mx-1", "Copy", "button");
        YoutubeBtn.classList.add("btn", "mx-1", "Send", "button");
        YoutubeBtn.setAttribute("id", "authbtn");
        SelectBtn.setAttribute("value", "".concat(CharCount_index));
        CopyBtn.setAttribute("value", "".concat(CharCount_index));
        YoutubeBtn.setAttribute("value", "".concat(CharCount_index));
        // Apending
        h2.append(button);
        AcordItem.append(h2);
        //collapsedDiv.
        // Over Text area Bar
        CharDiv.append(h3);
        CharDiv.append(PNo);
        AcordBody.append(CharDiv);
        // Textarea
        AcordBody.append(Textarea);
        // Button Bar
        ButtonDiv.append(SelectBtn);
        ButtonDiv.append(CopyBtn);
        ButtonDiv.append(YoutubeBtn);
        AcordBody.append(ButtonDiv);
        CharCount_index++; // Counter for how many TextAreas there is.
        if (SettingsLocal != "") {
            var hr = document.createElement("hr");
            var FontDiv = document.createElement("div");
            FontDiv.classList.add("d-flex", "justify-content-between");
            var h3_1 = document.createElement("h3");
            h3_1.innerHTML = "# Suggested Description: (" + SettingsLocal + ")";
            h3_1.setAttribute("class", "my-2");
            var PNo_1 = document.createElement("p");
            PNo_1.setAttribute("id", "CharCount".concat(CharCount_index));
            PNo_1.innerHTML = "CharCounter";
            var input = document.createElement("input");
            input.classList.add("form-control", "p-3", "my-2");
            input.setAttribute("id", "".concat(LocalID, "Title-").concat(index));
            input.setAttribute("placeholder", "title in locale language");
            LocalTextarea.setAttribute("id", "".concat(LocalID).concat(index));
            // Copy/select Buttons
            var ButtonDivL = document.createElement("div");
            ButtonDivL.classList.add("my-3");
            // Select
            var SelectLBtn = document.createElement("button");
            SelectLBtn.innerHTML = "Select Text";
            SelectLBtn.classList.add("btn", "mx-1", "Select", "button");
            SelectLBtn.setAttribute("value", "".concat(CharCount_index));
            // Copy
            var CopyBtnL = document.createElement("button");
            CopyBtnL.innerHTML = "Copy Text";
            CopyBtnL.classList.add("btn", "mx-1", "Copy", "button");
            CopyBtnL.setAttribute("value", "".concat(CharCount_index));
            // Youtube
            var YoutubeBtnL = document.createElement("button");
            YoutubeBtnL.innerHTML = "Update YT Vid";
            YoutubeBtnL.classList.add("btn", "mx-1", "Send", "button");
            YoutubeBtnL.setAttribute("id", "authbtn");
            YoutubeBtnL.setAttribute("value", "".concat(CharCount_index));
            // Appending
            ButtonDivL.append(SelectLBtn);
            ButtonDivL.append(CopyBtnL);
            ButtonDivL.append(YoutubeBtnL);
            FontDiv.append(h3_1);
            FontDiv.append(PNo_1);
            AcordBody.append(hr);
            AcordBody.append(FontDiv);
            AcordBody.append(input);
            AcordBody.append(LocalTextarea);
            AcordBody.append(ButtonDivL);
            CharCount_index++;
        }
        // Final Appening
        collapsedDiv.append(AcordBody);
        AcordItem.append(collapsedDiv);
        AcordDiv.append(AcordItem);
        DescDiv.append(AcordDiv);
    }
}
//#endregion
// Small Functions
//#region V Small Functions V
//#region AddClipDelay: Function Adds ClipDelay to 0:07:30 like timestamps
// Adds Clip Delay to a timestamp
function AddClipDelay(timestamp, Clipoffset) {
    // input: 0:07:28 Stream Time Marker
    // outputs: 8:06:58 (Timestamp Minus Clipoffset)
    var res = timestamp.split(" "); // *8:07:28*, Stream, Time, Marker
    var DigitA = res[0].split(":"); // *8*, *07*, *28*
    DigitA[2] = DigitA[2] - Clipoffset; // 28 - 30 = -2
    if (DigitA[2] < 0) {
        // if lower than 0
        if (DigitA[1] != "00") {
            // if 07 has value or not
            DigitA[1] = DigitA[1] - 1; // 07 = 06
            DigitA[2] = DigitA[2] + 60; // 60 + -2 = 58
            if (DigitA[1] < 9) {
                // adds back the 0 removed while doing math
                DigitA[1] = "0" + DigitA[1];
            }
            if (DigitA[2] < 9) {
                // adds back another 0 removed by math if need be
                DigitA = "0" + DigitA[2];
            }
        }
        else if (DigitA[0] != 0) {
            // if there is a 1 hour we could retract instead
            DigitA[0] = DigitA[0] - 1; // 0:42:01
            DigitA[1] = DigitA[1] + 59;
            DigitA[2] = DigitA[2] + 60;
            if (DigitA[1] < 9) {
                // adds back another 0 removed by math if need be
                DigitA[1] = "0" + DigitA[1];
            }
            if (DigitA[2] < 9) {
                // adds back another 0 removed by math if need be
                DigitA[2] = "0" + DigitA[2];
            }
        }
        else {
            // if we cant pull any numbers
            DigitA[2] = "00";
            return DigitA[0] + ":" + DigitA[1] + ":" + DigitA[2];
        }
    }
    if (DigitA[2] < 9) {
        return DigitA[0] + ":" + DigitA[1] + ":0" + DigitA[2];
    }
    return DigitA[0] + ":" + DigitA[1] + ":" + DigitA[2];
}
//#endregion
//#region to2Time: Function Shortens a Timestamp and removes non usefull infomation
function to2Time(timestamp) {
    // input: 0:07:28 Stream Time Marker OR 0:07:28
    // outputs: 7:28 (a perfect format timestamp)
    var res = timestamp.split(" "); // *8:07:28*, Stream, Time, Marker
    var DigitA = res[0].split(":"); // *8*, *07*, *28*
    if (DigitA[0] == "0") {
        // 8:07:28
        if (DigitA[1].match(/0\d/i)) {
            // 20:00
            if (DigitA[1].match(/00/i)) {
                DigitA[1] = DigitA[1].replace("00", "0");
                return DigitA[1] + ":" + DigitA[2]; // 20:00
            }
            DigitA[1] = DigitA[1].replace("0", "");
            return DigitA[1] + ":" + DigitA[2]; // 20:00
        }
        else {
            return DigitA[1] + ":" + DigitA[2];
        }
    }
    else {
        return res[0]; // returns values like  8:07:28, 24:03:53. does not touch timestamp
    }
}
//#endregion
//#region SectoTimestamp function, makes a timestamp that will work in the youtube description
// converts the time into minutes and hours from seconds
function SectoTimestamp(seconds) {
    var date = new Date(); // find out why it prints timestamps like "12:12:26" remove the 12 // Fixed
    date.setHours(0, 0, 0); // sets date to 00:00:00
    date.setSeconds(seconds); // adds secounds making it into a timestamp
    var dateText = date.toString(); // cuts timestamp out // effectively the same that gets printed when you do console.log(date);
    dateText = dateText.substring(16, 25);
    var DigitA = dateText.split(":"); // *8*, *07*, *28*
    if (DigitA[0] == "00") {
        // 8:07:28
        if (DigitA[1].match(/0\d/i)) {
            // 20:00
            if (DigitA[1].match(/00/i)) {
                DigitA[1] = DigitA[1].replace("00", "0");
                return DigitA[1] + ":" + DigitA[2]; // 20:00
            }
            DigitA[1] = DigitA[1].replace("0", "");
            return DigitA[1] + ":" + DigitA[2]; // 20:00
        }
        else {
            return DigitA[1] + ":" + DigitA[2];
        }
    }
    else {
        if (DigitA[0][0] == "0") {
            // removes stuff like 08:07:28
            return DigitA[0][1] + ":" + DigitA[1] + ":" + DigitA[2];
        }
        else {
            return dateText; // returns values like  8:07:28, 24:03:53. does not touch timestamp
        }
    }
}
//#endregion
//#region TimestampToDate(Timestamp String) converts a 1:09:24 timestamp into a date time
function TimestampToDate(timestamp) {
    //1:09:24
    var T = Array();
    T = timestamp.split(":");
    var date = new Date();
    date.setHours(0, 0, 0);
    if (T.length == 3) {
        date.setHours(T[0]);
        date.setMinutes(T[1]);
        date.setSeconds(T[2]);
        return date;
    }
    else {
        date.setMinutes(T[0]);
        date.setSeconds(T[1]);
        return date;
    }
}
//#endregion
//#region ErrorMessage() makes an alert from data
// Error messages out an alert
function ErrorMessage(string, Err) {
    alert(string + +"'' " + Err + " ''");
}
//#endregion
//#region parseISOString(Isostring) turns an iso String of a date into a Date object.
function parseISOString(Isostring) {
    var b = Isostring.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}
//#endregion
// needs a VALID Twitch App Auth Token
//#region validateToken() Validates Token if sucessful returns 1 if not 0
// Calls the Twitch api with Out App Acess Token and returns a ClientId and tells us if the App Acess Token is Valid or Not
function validateToken() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(AppAcessToken != undefined &&
                        AppAcessToken != "" &&
                        AppAcessToken != null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetch("https://id.twitch.tv/oauth2/validate", {
                            headers: {
                                Authorization: "Bearer " + AppAcessToken
                            }
                        })
                            .then(function (resp) { return resp.json(); })
                            .then(function (resp) {
                            if (resp.status) {
                                if (resp.status == 401) {
                                    console.log("This token is invalid ... " + resp.message);
                                    return 0;
                                }
                                console.log("Unexpected output with a status");
                                return 0;
                            }
                            if (resp.client_id) {
                                AclientId = resp.client_id;
                                TwitchConnected = true;
                                console.log("Token Validated Sucessfully");
                                var p = document.getElementById("AccessTokenTime");
                                var Time = new Date(resp.expires_in * 1000);
                                var TimeStrDash = Time.toISOString().split("-");
                                var TimeStrT = TimeStrDash[2].split("T");
                                var TimeString = "".concat(parseInt(TimeStrDash[1].substring(1, 2)) - 1, " Month ").concat(TimeStrT[0], " Days & ").concat(TimeStrT[1].substring(0, 8), " Hours");
                                p.innerHTML = "\u2022 Current Token Will Expire In: <br> ".concat(TimeString, ".");
                                return 1;
                            }
                            console.log("unexpected Output");
                            return 0;
                        })["catch"](function (err) {
                            console.log(err);
                            return 0;
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, 1];
                case 2: return [2 /*return*/, 0];
            }
        });
    });
}
//#endregion
//#region [async] HttpCaller(HttpCall) multipurpose HttpCaller calls the Httpcall returns The Response if Success if not: 0
// This makes most calls, intead of a lot of differnt functions this does them instead.
// TO find out what is called look where its called as the HTTPCALL would need to be sent over.
function HttpCalling(HttpCall) {
    return __awaiter(this, void 0, void 0, function () {
        var respon;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("".concat(HttpCall), {
                        headers: {
                            Authorization: "Bearer " + AppAcessToken,
                            "Client-ID": AclientId
                        }
                    })
                        .then(function (respon) { return respon.json(); })
                        .then(function (respon) {
                        // Return Response on Success
                        return respon;
                    })["catch"](function (err) {
                        // Print Error if any. And return 0
                        console.log(err);
                        return err;
                    })];
                case 1:
                    respon = _a.sent();
                    return [2 /*return*/, respon];
            }
        });
    });
}
//#endregion
//#endregion
//#region functions for ClipStamps
// gets clips from a date plus 1 day forward, needs date and streamerID
function GetClipsFromDate(StreamedDate, StreamerID) {
    return __awaiter(this, void 0, void 0, function () {
        var StartDate, EndDate, http2, resp, Clips, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    StartDate = new Date(StreamedDate);
                    EndDate = new Date(StreamedDate);
                    EndDate.setDate(EndDate.getDate() + 1);
                    http2 = "https://api.twitch.tv/helix/clips?broadcaster_id=".concat(StreamerID, "&first=100&started_at=").concat(StartDate.toISOString(), "&ended_at=").concat(EndDate.toISOString());
                    return [4 /*yield*/, HttpCalling(http2)];
                case 1:
                    resp = _a.sent();
                    Clips = Array();
                    for (i = 0; i < resp["data"].length; i++) {
                        if (resp["data"][i]["creator_name"].toLowerCase() ==
                            StreamerName.toLowerCase()) {
                            Clips.push(resp["data"][i]);
                        }
                        else {
                            // Ignore clips not made by self.
                        }
                    }
                    return [2 /*return*/, Clips];
            }
        });
    });
}
function SortClips(Clips, GetClipDates) {
    var SortedClips = Array(); // holds sorted clips
    var ClipsDateArr = Array(); // holds dates of clips for sorting.
    for (var index = 0; index < Clips.length; index++) {
        ClipsDateArr.push(parseISOString(Clips[index]["created_at"]));
    }
    // Sorting to correct dates
    ClipsDateArr.sort(function (a, b) {
        return a - b;
    });
    for (var q = 0; q < ClipsDateArr.length; q++) {
        for (var y = 0; y < Clips.length; y++) {
            // 11 elements in one array
            var Date_1 = parseISOString(Clips[y]["created_at"].toString()); // Clip Unsorted Dates
            if (ClipsDateArr[q].toString() == Date_1.toString()) {
                SortedClips.push(Clips[y]);
            }
        }
    }
    if (GetClipDates == true) {
        return ClipsDateArr;
    }
    else {
        return SortedClips;
    }
}
// changes titles of acord buttons
function ChangeAcordButtonNames(Clips, index, AcordButtonArr) {
    return __awaiter(this, void 0, void 0, function () {
        var gameresp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpCalling("https://api.twitch.tv/helix/games?id=".concat(Clips[0]["game_id"]) // just picks the game of the first clips data.
                    )];
                case 1:
                    gameresp = _a.sent();
                    if (index % 2) {
                        AcordButtonArr[index].innerHTML =
                            "<img class='imgIcon me-2' src='img\\Icons\\TimestampTXTIcon.png'> " +
                                "| " +
                                StreamDatesArr[index] +
                                " - Playing: '".concat(gameresp["data"][0]["name"], "'  \u2192 With: ").concat(Clips.length, " Clips");
                    }
                    else {
                        AcordButtonArr[index].innerHTML =
                            "<img class='imgIcon me-2' src='img\\Icons\\TimestampTXT2Icon.png'> " +
                                "| " +
                                StreamDatesArr[index] +
                                " - Playing: '".concat(gameresp["data"][0]["name"], "'  \u2192 With: ").concat(Clips.length, " Clips");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
//#endregion
