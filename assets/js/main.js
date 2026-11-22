/**
 * OCEANIA SEAFOOD & BBQ BUFFET — GLOBAL APPLICATION ENGINE (main.js)
 * ------------------------------------------------------------------
 * Responsibilities:
 *  1. Shared state & utilities (window.OceaniaApp: Toast, Modals, localStorage bookings, SVG QR generator)
 *  2. Sticky Glassmorphism Header on scroll + Floating Back-to-Top button
 *  3. Header Live Search Autocomplete (12+ signature dishes with thumbnail & "Đang phục vụ" status)
 *  4. Global Navigation Router, Dish/Blog/Branch card click handlers, Mobile Drawer (S22)
 *  5. Homepage (index.html): 3-Topic Hero Carousel, Fast Booking Quick-Bar, Category Tab Filter with Fade-In
 *  6. Menu (menu.html): Culinary & Nutrition Database, realtime search, lightbox & category filters
 *  7. Pricing (pricing.html): Interactive Cost Calculator & Kids Height Ruler
 *  8. Promotions (promotions.html): Live Flashsale Countdown, Promo Code Modal (S14), Group Party Form (S15)
 *  9. Blog (blog.html) & Post Detail (post-detail.html): Editorial Filter, Search & Live Comments (S21)
 * 10. Locations (locations.html): 3 HCMC Branch Google Maps Switcher, GPS Link, Contact Form (S19/S20)
 * 11. Reviews & VIP (reviews.html): Review Filter, Booking Code Verification (S16/S17) & Live Review (S18)
 * 12. Careers (careers.html): Kitchen/Hall Department Filter, JD Accordion & Online CV Application Form (S26)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'oceania_bookings_v1';

  /* ==========================================================================
     1. HCMC BRANCH DATA & DEFAULT BOOKINGS
     ========================================================================== */
  var BRANCH_DATA = {
    'Vincom Đồng Khởi Q1': {
      name: 'Vincom Đồng Khởi, Quận 1',
      shortName: 'Vincom Đồng Khởi Q1',
      address: 'Tầng B3, Vincom Center Đồng Khởi, 72 Lê Thánh Tôn, Quận 1, TP.HCM',
      capacity: '420 khách • 8 phòng VIP • Bể hải sản 18m',
      image: 'assets/figma/da2f6.png',
      gpsUrl: 'https://www.google.com/maps/search/?api=1&query=Vincom+Center+Dong+Khoi+72+Le+Thanh+Ton+Quan+1+TPHCM',
      embedUrl: 'https://maps.google.com/maps?q=Vincom%20Center%20Dong%20Khoi%2072%20Le%20Thanh%20Ton%20Ho%20Chi%20Minh&t=&z=16&ie=UTF8&iwloc=&output=embed'
    },
    'Lotte Mart Q7': {
      name: 'Lotte Mart, Quận 7',
      shortName: 'Lotte Mart Q7',
      address: 'Tầng 3, Lotte Mart Nam Sài Gòn, 469 Nguyễn Hữu Thọ, Quận 7, TP.HCM',
      capacity: '500 khách • Khu vui chơi trẻ em • Bãi đỗ ô tô rộng',
      image: 'assets/figma/af49c.png',
      gpsUrl: 'https://www.google.com/maps/search/?api=1&query=Lotte+Mart+Quan+7+469+Nguyen+Huu+Tho+TPHCM',
      embedUrl: 'https://maps.google.com/maps?q=Lotte%20Mart%20469%20Nguyen%20Huu%20Tho%20District%207%20Ho%20Chi%20Minh&t=&z=16&ie=UTF8&iwloc=&output=embed'
    },
    'Cantavil Thủ Đức': {
      name: 'Cantavil Premier, TP. Thủ Đức',
      shortName: 'Cantavil Thủ Đức',
      address: 'Tầng 5, Cantavil Premier, Số 1 Song Hành Xa Lộ Hà Nội, TP. Thủ Đức, TP.HCM',
      capacity: '380 khách • Sảnh kính toàn cảnh Xa Lộ • Phòng tiệc đoàn 60 khách',
      image: 'assets/figma/52fca.png',
      gpsUrl: 'https://www.google.com/maps/search/?api=1&query=Cantavil+Premier+Song+Hanh+Thu+Duc+TPHCM',
      embedUrl: 'https://maps.google.com/maps?q=Cantavil%20Premier%20Song%20Hanh%20An%20Phu%20Ho%20Chi%20Minh&t=&z=16&ie=UTF8&iwloc=&output=embed'
    }
  };

  var DEFAULT_BOOKINGS = [
    {
      code: 'OCN-311026-001',
      name: 'Nguyễn Minh Khôi',
      phone: '0909123456',
      email: 'minhkhoi.nguyen@gmail.com',
      branch: 'Vincom Đồng Khởi, Quận 1',
      address: 'Tầng B3, Vincom Center Đồng Khởi, 72 Lê Thánh Tôn, Quận 1, TP.HCM',
      date: 'Thứ Bảy, 31/10/2026',
      time: '19:00',
      shift: '19:00 (Ca tối Buffet Thượng Hạng)',
      adults: 4,
      kids: 1,
      babies: 0,
      seating: 'Gần bể hải sản • Ghế trẻ em',
      note: 'Kỷ niệm gia đình, ưu tiên bàn gần bể kính hải sản.',
      tableCode: 'Khu Hải Sản — Bàn B08',
      status: 'ĐÃ XÁC NHẬN',
      totalEst: '2.283.660đ',
      createdAt: Date.now() - 36000000
    },
    {
      code: 'OCN-240819',
      name: 'Nguyễn Minh Anh',
      phone: '0912345678',
      email: 'minhanh.nguyen@gmail.com',
      branch: 'Vincom Đồng Khởi, Quận 1',
      address: 'Tầng B3, Vincom Center Đồng Khởi, 72 Lê Thánh Tôn, Quận 1, TP.HCM',
      date: 'Chủ Nhật, 01/11/2026',
      time: '18:30',
      shift: '18:30 (Ca tối Buffet Thượng Hạng)',
      adults: 4,
      kids: 1,
      babies: 0,
      seating: 'Gần bể hải sản • Bàn yên tĩnh',
      note: 'Kỷ niệm ngày cưới, nhờ nhà hàng chuẩn bị bàn góc yên tĩnh.',
      tableCode: 'Khu Hải Sản — Bàn B12',
      status: 'ĐÃ XÁC NHẬN',
      totalEst: '2.283.660đ',
      createdAt: Date.now() - 86400000
    },
    {
      code: 'OCN-240905',
      name: 'Trần Hoàng Nam',
      phone: '0987654321',
      email: 'hoangnam.tran@company.vn',
      branch: 'Lotte Mart, Quận 7',
      address: 'Tầng 3, Lotte Mart Nam Sài Gòn, 469 Nguyễn Hữu Thọ, Quận 7, TP.HCM',
      date: 'Thứ Bảy, 07/11/2026',
      time: '19:00',
      shift: '19:00 (Ca tối Buffet Thượng Hạng)',
      adults: 6,
      kids: 2,
      babies: 1,
      seating: 'Bàn rộng cho gia đình • Ghế trẻ em',
      note: 'Sinh nhật bé 5 tuổi, đăng ký gói trang trí bóng bay.',
      tableCode: 'Khu Sảnh Chính — Bàn A12',
      status: 'ĐÃ XÁC NHẬN',
      totalEst: '3.544.560đ',
      createdAt: Date.now() - 120000000
    }
  ];

  function getBookings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOOKINGS));
        return DEFAULT_BOOKINGS.slice();
      }
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOOKINGS));
        return DEFAULT_BOOKINGS.slice();
      }
      /* Ensure OCN-311026-001 exists so the Figma default code always resolves */
      var hasDefault = parsed.some(function (b) { return b.code === 'OCN-311026-001'; });
      if (!hasDefault) {
        parsed.unshift(DEFAULT_BOOKINGS[0]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      return DEFAULT_BOOKINGS.slice();
    }
  }

  function saveBookings(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function fmtVnd(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  }

  /* ==========================================================================
     REAL ISO/IEC 18004 QR CODE GENERATOR (VERSION 1-12, EC LEVEL M, ZERO CDN)
     ========================================================================== */
  var QR_GF_EXP = new Array(256);
  var QR_GF_LOG = new Array(256);
  (function initGaloisField() {
    var x = 1;
    for (var i = 0; i < 256; i++) {
      QR_GF_EXP[i] = x;
      QR_GF_LOG[x] = i;
      x <<= 1;
      if (x & 256) x ^= 285;
    }
    QR_GF_LOG[0] = 0;
  })();

  function qrGfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return QR_GF_EXP[(QR_GF_LOG[a] + QR_GF_LOG[b]) % 255];
  }

  function qrRsEcc(data, eccCount) {
    var gen = [1];
    for (var i = 0; i < eccCount; i++) {
      var next = new Array(gen.length + 1);
      for (var k = 0; k < next.length; k++) next[k] = 0;
      var factor = QR_GF_EXP[i];
      for (var j = 0; j < gen.length; j++) {
        next[j] ^= gen[j];
        next[j + 1] ^= qrGfMul(gen[j], factor);
      }
      gen = next;
    }
    var msg = data.slice();
    for (var p = 0; p < eccCount; p++) msg.push(0);
    for (var m = 0; m < data.length; m++) {
      var lead = msg[m];
      if (lead !== 0) {
        for (var g = 0; g < gen.length; g++) {
          msg[m + g] ^= qrGfMul(gen[g], lead);
        }
      }
    }
    return msg.slice(data.length);
  }

  var QR_ALIGN = {
    1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34],
    7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50],
    11: [6, 30, 54], 12: [6, 32, 58]
  };
  var QR_RS_M = {
    1: [[1, 26, 16]],
    2: [[1, 44, 28]],
    3: [[1, 70, 44]],
    4: [[2, 50, 32]],
    5: [[2, 67, 43]],
    6: [[4, 43, 27]],
    7: [[4, 49, 31]],
    8: [[2, 60, 38], [2, 61, 39]],
    9: [[3, 58, 36], [2, 59, 37]],
    10: [[4, 69, 43], [1, 70, 44]],
    11: [[1, 80, 50], [4, 81, 51]],
    12: [[6, 58, 36], [2, 59, 37]]
  };

  function utf8ToByteArray(str) {
    var encoded = unescape(encodeURIComponent(String(str)));
    var arr = [];
    for (var i = 0; i < encoded.length; i++) {
      arr.push(encoded.charCodeAt(i) & 0xff);
    }
    return arr;
  }

  function qrBchFormat(mask) {
    /* EC Level M = 0b00 */
    var d = mask & 7;
    var r = d << 10;
    for (var i = 14; i >= 10; i--) {
      if ((r >> i) & 1) r ^= (0x537 << (i - 10));
    }
    return ((d << 10) | r) ^ 0x5412;
  }

  function qrBchVersion(ver) {
    var r = ver << 12;
    for (var i = 17; i >= 12; i--) {
      if ((r >> i) & 1) r ^= (0x1F25 << (i - 12));
    }
    return (ver << 12) | r;
  }

  function buildQrMatrix(text) {
    var bytes = utf8ToByteArray(text || 'OCN-311026-001');
    var ver = 1;
    var spec = null;
    for (var v = 1; v <= 12; v++) {
      var groups = QR_RS_M[v];
      var totalDataBytes = 0;
      for (var gi = 0; gi < groups.length; gi++) {
        totalDataBytes += groups[gi][0] * groups[gi][2];
      }
      var lenBits = v <= 9 ? 8 : 16;
      if (4 + lenBits + bytes.length * 8 <= totalDataBytes * 8) {
        ver = v;
        spec = groups;
        break;
      }
    }
    if (!spec) {
      ver = 12;
      spec = QR_RS_M[12];
      bytes = bytes.slice(0, 280);
    }

    var totalDataCw = 0;
    for (var s0 = 0; s0 < spec.length; s0++) totalDataCw += spec[s0][0] * spec[s0][2];

    var bits = [];
    function pushBits(val, count) {
      for (var b = count - 1; b >= 0; b--) bits.push((val >> b) & 1);
    }
    pushBits(4, 4); /* Byte mode */
    pushBits(bytes.length, ver <= 9 ? 8 : 16);
    for (var bi = 0; bi < bytes.length; bi++) pushBits(bytes[bi], 8);
    var maxBits = totalDataCw * 8;
    for (var t = 0; t < 4 && bits.length < maxBits; t++) bits.push(0);
    while (bits.length % 8 !== 0) bits.push(0);
    var padToggle = 0;
    while (bits.length < maxBits) {
      pushBits(padToggle ? 0x11 : 0xEC, 8);
      padToggle ^= 1;
    }

    var codewords = [];
    for (var ci = 0; ci < bits.length; ci += 8) {
      var cw = 0;
      for (var cb = 0; cb < 8; cb++) cw = (cw << 1) | bits[ci + cb];
      codewords.push(cw);
    }

    var dataBlocks = [];
    var eccBlocks = [];
    var offset = 0;
    var maxDataLen = 0;
    var maxEccLen = 0;
    for (var g = 0; g < spec.length; g++) {
      var cnt = spec[g][0], totCw = spec[g][1], datCw = spec[g][2];
      var eccLen = totCw - datCw;
      if (datCw > maxDataLen) maxDataLen = datCw;
      if (eccLen > maxEccLen) maxEccLen = eccLen;
      for (var c = 0; c < cnt; c++) {
        var slice = codewords.slice(offset, offset + datCw);
        offset += datCw;
        dataBlocks.push(slice);
        eccBlocks.push(qrRsEcc(slice, eccLen));
      }
    }

    var streamBits = [];
    function pushByte(vByte) {
      for (var b = 7; b >= 0; b--) streamBits.push((vByte >> b) & 1);
    }
    for (var di = 0; di < maxDataLen; di++) {
      for (var db = 0; db < dataBlocks.length; db++) {
        if (di < dataBlocks[db].length) pushByte(dataBlocks[db][di]);
      }
    }
    for (var ei = 0; ei < maxEccLen; ei++) {
      for (var eb = 0; eb < eccBlocks.length; eb++) {
        if (ei < eccBlocks[eb].length) pushByte(eccBlocks[eb][ei]);
      }
    }

    var n = ver * 4 + 17;
    var bestGrid = null;
    var bestPenalty = 1e9;

    function buildBaseGrid() {
      var grid = new Array(n);
      var fixed = new Array(n);
      for (var r = 0; r < n; r++) {
        grid[r] = new Array(n);
        fixed[r] = new Array(n);
        for (var c = 0; c < n; c++) { grid[r][c] = 0; fixed[r][c] = false; }
      }
      function setFixed(r, c, val) {
        if (r >= 0 && r < n && c >= 0 && c < n) { grid[r][c] = val; fixed[r][c] = true; }
      }
      function placeFinder(topR, leftC) {
        for (var dr = -1; dr <= 7; dr++) {
          for (var dc = -1; dc <= 7; dc++) {
            var rr = topR + dr, cc = leftC + dc;
            if (rr < 0 || rr >= n || cc < 0 || cc >= n) continue;
            var isDark = (dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6) &&
              (dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
            setFixed(rr, cc, isDark ? 1 : 0);
          }
        }
      }
      placeFinder(0, 0);
      placeFinder(0, n - 7);
      placeFinder(n - 7, 0);

      var pos = QR_ALIGN[ver] || [];
      for (var ai = 0; ai < pos.length; ai++) {
        for (var aj = 0; aj < pos.length; aj++) {
          var ar = pos[ai], ac = pos[aj];
          if (fixed[ar][ac]) continue;
          for (var dr = -2; dr <= 2; dr++) {
            for (var dc = -2; dc <= 2; dc++) {
              var adark = (Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0));
              setFixed(ar + dr, ac + dc, adark ? 1 : 0);
            }
          }
        }
      }

      for (var ti = 8; ti < n - 8; ti++) {
        if (!fixed[6][ti]) setFixed(6, ti, (ti % 2 === 0) ? 1 : 0);
        if (!fixed[ti][6]) setFixed(ti, 6, (ti % 2 === 0) ? 1 : 0);
      }

      setFixed(n - 8, 8, 1); /* Dark module */

      /* Reserve format areas */
      for (var fk = 0; fk <= 8; fk++) {
        if (!fixed[8][fk]) setFixed(8, fk, 0);
        if (!fixed[fk][8]) setFixed(fk, 8, 0);
      }
      for (var fk2 = 0; fk2 < 8; fk2++) {
        if (!fixed[8][n - 1 - fk2]) setFixed(8, n - 1 - fk2, 0);
        if (!fixed[n - 1 - fk2][8]) setFixed(n - 1 - fk2, 8, 0);
      }

      if (ver >= 7) {
        var vb = qrBchVersion(ver);
        for (var vi = 0; vi < 18; vi++) {
          var vbit = (vb >> vi) & 1;
          setFixed(Math.floor(vi / 3), n - 11 + (vi % 3), vbit);
          setFixed(n - 11 + (vi % 3), Math.floor(vi / 3), vbit);
        }
      }
      return { grid: grid, fixed: fixed };
    }

    function applyMaskBit(mask, r, c) {
      if (mask === 0) return (r + c) % 2 === 0;
      if (mask === 1) return r % 2 === 0;
      if (mask === 2) return c % 3 === 0;
      if (mask === 3) return (r + c) % 3 === 0;
      if (mask === 4) return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
      if (mask === 5) return ((r * c) % 2 + (r * c) % 3) === 0;
      if (mask === 6) return (((r * c) % 2 + (r * c) % 3) % 2) === 0;
      return (((r + c) % 2 + (r * c) % 3) % 2) === 0;
    }

    function writeFormatBits(grid, mask) {
      var fmt = qrBchFormat(mask);
      for (var k = 0; k <= 5; k++) grid[8][k] = (fmt >> (14 - k)) & 1;
      grid[8][7] = (fmt >> 8) & 1;
      grid[8][8] = (fmt >> 7) & 1;
      grid[7][8] = (fmt >> 6) & 1;
      for (var k2 = 9; k2 <= 14; k2++) grid[14 - k2][8] = (fmt >> (14 - k2)) & 1;

      for (var j = 0; j <= 6; j++) grid[n - 1 - j][8] = (fmt >> (14 - j)) & 1;
      for (var j2 = 7; j2 <= 14; j2++) grid[8][n - 15 + j2] = (fmt >> (14 - j2)) & 1;
    }

    function evalPenalty(grid) {
      var pen = 0;
      var darkCount = 0;
      for (var r = 0; r < n; r++) {
        var rowRun = 1, colRun = 1;
        for (var c = 0; c < n; c++) {
          if (grid[r][c]) darkCount++;
          if (c > 0) {
            if (grid[r][c] === grid[r][c - 1]) rowRun++;
            else { if (rowRun >= 5) pen += 3 + (rowRun - 5); rowRun = 1; }
            if (grid[c][r] === grid[c - 1][r]) colRun++;
            else { if (colRun >= 5) pen += 3 + (colRun - 5); colRun = 1; }
          }
          if (r < n - 1 && c < n - 1) {
            var s = grid[r][c] + grid[r][c + 1] + grid[r + 1][c] + grid[r + 1][c + 1];
            if (s === 0 || s === 4) pen += 3;
          }
        }
        if (rowRun >= 5) pen += 3 + (rowRun - 5);
        if (colRun >= 5) pen += 3 + (colRun - 5);
      }
      pen += Math.floor(Math.abs((darkCount * 100) / (n * n) - 50) / 5) * 10;
      return pen;
    }

    for (var mask = 0; mask < 8; mask++) {
      var st = buildBaseGrid();
      var gGrid = st.grid, fGrid = st.fixed;
      var bitIdx = 0;
      var dirUp = true;
      for (var col = n - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        for (var step = 0; step < n; step++) {
          var row = dirUp ? (n - 1 - step) : step;
          for (var sub = 0; sub < 2; sub++) {
            var cc = col - sub;
            if (!fGrid[row][cc]) {
              var bitVal = bitIdx < streamBits.length ? streamBits[bitIdx] : 0;
              bitIdx++;
              gGrid[row][cc] = applyMaskBit(mask, row, cc) ? (bitVal ^ 1) : bitVal;
            }
          }
        }
        dirUp = !dirUp;
      }
      writeFormatBits(gGrid, mask);
      var pScore = evalPenalty(gGrid);
      if (pScore < bestPenalty) {
        bestPenalty = pScore;
        bestGrid = gGrid;
      }
    }
    return bestGrid;
  }

  function stripVnAccents(s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, function (c) { return c === 'đ' ? 'd' : 'D'; });
  }

  function resolveBookingQrText(inputOrCode) {
    if (inputOrCode && typeof inputOrCode === 'object') {
      var br = inputOrCode.branch || 'Vincom Dong Khoi Q1';
      var brShort = br.indexOf('Lotte') !== -1 ? 'Lotte Q7' : (br.indexOf('Cantavil') !== -1 ? 'Cantavil TD' : 'Vincom Q1');
      var dateM = String(inputOrCode.date || '31/10/2026').match(/(\d{1,2}\/\d{1,2}(?:\/\d{4})?)/);
      var dShort = dateM ? dateM[1] : '31/10/2026';
      var st = stripVnAccents(inputOrCode.status || 'DA XAC NHAN');
      return [
        'OCEANIA BUFFET',
        inputOrCode.code || 'OCN-311026-001',
        (inputOrCode.phone || '1900888999') + ' ' + stripVnAccents(inputOrCode.name || 'Khach'),
        brShort + ' | ' + (inputOrCode.time || '19:00') + ' ' + dShort,
        (inputOrCode.adults || 4) + 'NL+' + (inputOrCode.kids || 1) + 'TE+' + (inputOrCode.babies || 0) + 'BE | ' + st
      ].join('\n');
    }
    var raw = String(inputOrCode || 'OCN-311026-001').trim();
    if (/^OCN-/.test(raw)) {
      var list = getBookings();
      var found = list.find(function (b) { return b.code === raw; });
      if (found) return resolveBookingQrText(found);
    }
    return raw;
  }

  function renderQrPngDataUrl(codeOrBooking, sizePx) {
    var payload = resolveBookingQrText(codeOrBooking);
    var matrix = buildQrMatrix(payload);
    var n = matrix.length;
    var quiet = 4;
    var dim = n + quiet * 2;
    var px = Math.max(200, sizePx || 260);
    var scale = Math.max(2, Math.floor(px / dim));
    var outSize = dim * scale;
    var canvas = document.createElement('canvas');
    canvas.width = outSize;
    canvas.height = outSize;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, outSize, outSize);
    ctx.fillStyle = '#000000';
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (matrix[r][c]) {
          ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
        }
      }
    }
    return canvas.toDataURL('image/png');
  }

  function buildSvgQrCode(codeOrBooking) {
    var payload = resolveBookingQrText(codeOrBooking);
    var matrix = buildQrMatrix(payload);
    var size = matrix.length;
    var quiet = 4;
    var dim = size + quiet * 2;
    var paths = [];
    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        if (matrix[r][c]) {
          paths.push('M' + (c + quiet) + ',' + (r + quiet) + 'h1v1h-1z');
        }
      }
    }
    var safeTitle = payload.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    return (
      '<svg viewBox="0 0 ' + dim + ' ' + dim + '" width="100%" height="100%" shape-rendering="crispEdges" role="img" aria-label="Ma QR dat ban Oceania" data-qr-payload="' + safeTitle + '" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="' + dim + '" height="' + dim + '" fill="#ffffff"/>' +
      '<path d="' + paths.join('') + '" fill="#000000"/>' +
      '</svg>'
    );
  }

  /* Toast & Modal Utilities */
  var toastTimer = null;
  function showToast(msg) {
    var el = document.getElementById('oceania-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove('show');
    }, 3400);
  }

  function openModal(id) {
    var modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
  }

  function closeModal(id) {
    var modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
  }

  function closeAllOverlays() {
    document.querySelectorAll('.oceania-modal-overlay.open, .oceania-search-drawer.open, .oceania-mobile-drawer.open').forEach(function (el) {
      el.classList.remove('open');
    });
  }

  function getText(el) {
    return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
  }

  /* Expose shared utilities to booking.js and lookup.js */
  window.OceaniaApp = {
    STORAGE_KEY: STORAGE_KEY,
    BRANCH_DATA: BRANCH_DATA,
    getBookings: getBookings,
    saveBookings: saveBookings,
    fmtVnd: fmtVnd,
    buildSvgQrCode: buildSvgQrCode,
    buildQrMatrix: buildQrMatrix,
    resolveBookingQrText: resolveBookingQrText,
    renderQrPngDataUrl: renderQrPngDataUrl,
    showToast: showToast,
    openModal: openModal,
    closeModal: closeModal,
    closeAllOverlays: closeAllOverlays,
    getText: getText
  };

  /* ==========================================================================
     2. 12+ DISH CULINARY & NUTRITION DATABASE (AUTOCOMPLETE, MENU & DISH DETAIL)
     ========================================================================== */
  var DISH_DATABASE = [
    {
      title: 'Tôm hùm bông nướng phô mai đút lò',
      category: 'Cua ghẹ bơi bể',
      station: 'Quầy Hải Sản Nướng Than Hoa — Line B2',
      status: 'Đang phục vụ • Ra món mỗi 15 phút',
      image: 'assets/figma/46d9d.png',
      gallery: [
        'assets/figma/46d9d.png',
        'assets/figma/f1d84.png',
        'assets/figma/fbc4b.png',
        'assets/figma/19f0e.png'
      ],
      desc: 'Tôm hùm bông tươi sống bắt trực tiếp từ bể kính nước biển lạnh tại nhà hàng, xẻ đôi nướng trên than hồng cùng lớp phô mai Mozzarella và bơ tỏi Pháp béo ngậy.',
      kcal: '285 kcal',
      protein: '26.4 g',
      fat: '14.2 g',
      minerals: '520 mg',
      allergen: 'Giáp xác (Tôm hùm), Sữa & Phô mai (Lactose). Thực khách dị ứng hải sản có vỏ hoặc bất dung nạp lactose vui lòng lưu ý.',
      sauce: 'Muối ớt xanh Nha Trang giã tay, Sốt chanh dây bơ tỏi, Muối tiêu Phú Quốc vắt tắc tươi.'
    },
    {
      title: 'Cua Cà Mau hấp sả tươi',
      category: 'Cua ghẹ bơi bể',
      station: 'Quầy Hải Sản Bơi Bể — Line A1',
      status: 'Đang phục vụ • Bắt sống tại bể',
      image: 'assets/figma/f1d84.png',
      gallery: [
        'assets/figma/f1d84.png',
        'assets/figma/fbc4b.png',
        'assets/figma/46d9d.png',
        'assets/figma/2bb0e.png'
      ],
      desc: 'Cua thịt và cua gạch Cà Mau tuyển chọn từng con từ bể kính nước mặn tại sảnh, hấp nóng cùng bia lúa mạch và sả cây đập dập giữ trọn vị ngọt thanh tự nhiên của biển cả.',
      kcal: '195 kcal',
      protein: '25.8 g',
      fat: '3.2 g',
      minerals: '540 mg',
      allergen: 'Giáp xác (Cua biển). Không chứa gluten trong nước hấp nguyên bản.',
      sauce: 'Muối tiêu Phú Quốc vắt tắc tươi, Sốt ớt xanh Nha Trang giã tay, Sốt me chua ngọt đặc chế.'
    },
    {
      title: 'Ghẹ xanh Phú Quốc hấp bia',
      category: 'Cua ghẹ bơi bể',
      station: 'Quầy Hải Sản Bơi Bể — Line A1',
      status: 'Đang phục vụ • Bơi bể tươi sống',
      image: 'assets/figma/fbc4b.png',
      gallery: [
        'assets/figma/fbc4b.png',
        'assets/figma/f1d84.png',
        'assets/figma/2bb0e.png',
        'assets/figma/ce17a.png'
      ],
      desc: 'Ghẹ xanh Hàm Ninh Phú Quốc chắc thịt, vỏ mỏng chấm bông trắng, hấp cách thủy cùng bia mạch nha, sả tươi và lá chanh non.',
      kcal: '175 kcal',
      protein: '25.1 g',
      fat: '2.4 g',
      minerals: '510 mg',
      allergen: 'Giáp xác (Ghẹ biển).',
      sauce: 'Sốt hải sản ớt hiểm xanh, Muối tiêu chanh Phú Quốc.'
    },
    {
      title: 'Thăn ngoại bò Wagyu nướng than Binchotan',
      category: 'Bò nướng than hoa',
      station: 'Quầy Bò Nướng Than Hoa — Line B1',
      status: 'Đang phục vụ • Nướng theo yêu cầu',
      image: 'assets/figma/f0ea2.png',
      gallery: [
        'assets/figma/f0ea2.png',
        'assets/figma/5809a.png',
        'assets/figma/eb973.png',
        'assets/figma/6a8f0.png'
      ],
      desc: 'Thăn ngoại bò Wagyu Úc vân mỡ cẩm thạch MBS 6-7 thái lát chuẩn 6mm, nướng trực tiếp trên than trắng Binchotan Nhật Bản không khói giúp thịt mềm tan trong miệng.',
      kcal: '380 kcal',
      protein: '24.2 g',
      fat: '28.5 g',
      minerals: '260 mg',
      allergen: 'Không chứa chất gây dị ứng phổ biến.',
      sauce: 'Sốt tiêu đen nấm Truffle, Sốt Ponzu cam chanh Nhật, Muối hồng Himalaya.'
    },
    {
      title: 'Bào ngư Hàn Quốc sốt dầu hào',
      category: 'Cua ghẹ bơi bể',
      station: 'Quầy Hải Sản Cao Cấp — Line A2',
      status: 'Đang phục vụ • Món thượng hạng',
      image: 'assets/figma/19f0e.png',
      gallery: [
        'assets/figma/19f0e.png',
        'assets/figma/46d9d.png',
        'assets/figma/f1d84.png',
        'assets/figma/ce17a.png'
      ],
      desc: 'Bào ngư Hàn Quốc sống khứa vân tổ ong, om lửa nhỏ cùng sốt dầu hào thượng hạng, nấm đông cô Nhật và bông cải xanh giòn ngọt.',
      kcal: '185 kcal',
      protein: '21.6 g',
      fat: '4.5 g',
      minerals: '590 mg',
      allergen: 'Nhuyễn thể (Bào ngư), Dầu hào.',
      sauce: 'Sốt dầu hào nguyên bản hoặc Muối tiêu chanh.'
    },
    {
      title: 'Tôm càng xanh nướng muối ớt',
      category: 'Cua ghẹ bơi bể',
      station: 'Quầy Hải Sản Nướng Than — Line A3',
      status: 'Đang phục vụ • Nướng liên tục',
      image: 'assets/figma/2bb0e.png',
      gallery: [
        'assets/figma/2bb0e.png',
        'assets/figma/f1d84.png',
        'assets/figma/fbc4b.png',
        'assets/figma/46d9d.png'
      ],
      desc: 'Tôm càng xanh miền Tây gạch son đầy đầu, ướp muối ớt rừng giã tay nướng trên lửa than hồng thơm nức.',
      kcal: '210 kcal',
      protein: '23.4 g',
      fat: '6.8 g',
      minerals: '470 mg',
      allergen: 'Giáp xác (Tôm càng xanh).',
      sauce: 'Sốt ớt xanh Nha Trang, Muối tiêu chanh.'
    },
    {
      title: 'Hàu sữa Pháp nướng mỡ hành',
      category: 'Cua ghẹ bơi bể',
      station: 'Quầy Hải Sản Nướng Than — Line A4',
      status: 'Đang phục vụ • Nướng liên tục',
      image: 'assets/figma/ce17a.png',
      gallery: [
        'assets/figma/ce17a.png',
        'assets/figma/19f0e.png',
        'assets/figma/2bb0e.png',
        'assets/figma/f1d84.png'
      ],
      desc: 'Hàu sữa béo mọng tách vỏ tại chỗ, nướng trên vỉ than hồng cùng mỡ hành phi giòn, đậu phộng rang và hành tím Lý Sơn.',
      kcal: '160 kcal',
      protein: '14.5 g',
      fat: '9.8 g',
      minerals: '620 mg (Giàu Kẽm)',
      allergen: 'Nhuyễn thể hai mảnh vỏ (Hàu), Đậu phộng (Lạc).',
      sauce: 'Nước mắm chua ngọt tỏi ớt, Sốt ớt xanh hải sản.'
    },
    {
      title: 'Sashimi cá hồi & cá ngừ đại dương',
      category: 'Dimsum',
      station: 'Quầy Nhật Bản & Sashimi — Line C1',
      status: 'Đang phục vụ • Cắt lát trực tiếp',
      image: 'assets/figma/16ace.png',
      gallery: [
        'assets/figma/16ace.png',
        'assets/figma/22ac0.png',
        'assets/figma/0f938.png',
        'assets/figma/869c2.png'
      ],
      desc: 'Cá hồi Nauy nhập khẩu đường hàng không mỗi ngày kết hợp cá ngừ vây vàng đại dương và bạch tuộc Nhật, trình bày trên thuyền đá tuyết giữ lạnh 2°C.',
      kcal: '210 kcal',
      protein: '22.8 g',
      fat: '13.4 g (Giàu Omega-3)',
      minerals: '390 mg',
      allergen: 'Cá biển tươi sống, Đậu nành (Nước tương Kikkoman).',
      sauce: 'Nước tương Nhật Kikkoman, Mù tạt Wasabi tươi, Gừng hồng ngâm chua.'
    },
    {
      title: 'Dẻ sườn bò Mỹ nướng sốt Galbi',
      category: 'Bò nướng than hoa',
      station: 'Quầy Bò Nướng Than Hoa — Line B2',
      status: 'Đang phục vụ • Phục vụ nóng',
      image: 'assets/figma/5809a.png',
      gallery: [
        'assets/figma/5809a.png',
        'assets/figma/f0ea2.png',
        'assets/figma/eb973.png',
        'assets/figma/6a8f0.png'
      ],
      desc: 'Dẻ sườn bò Mỹ USDA Choice giàu vân mỡ cẩm thạch, ướp sốt lê Hàn Quốc Galbi trong 12 giờ, nướng trên than trắng Binchotan.',
      kcal: '340 kcal',
      protein: '27.5 g',
      fat: '22.0 g',
      minerals: '210 mg',
      allergen: 'Đậu nành (Nước tương ướp), Dầu mè.',
      sauce: 'Sốt tương Ssamjang Hàn Quốc, Kim chi cải thảo.'
    },
    {
      title: 'Há cảo tôm tươi hoàng kim',
      category: 'Dimsum',
      station: 'Quầy Dimsum Hoàng Gia — Line C2',
      status: 'Đang phục vụ • Hấp trong xửng tre',
      image: 'assets/figma/22ac0.png',
      gallery: [
        'assets/figma/22ac0.png',
        'assets/figma/0f938.png',
        'assets/figma/869c2.png',
        'assets/figma/16ace.png'
      ],
      desc: 'Vỏ bột mì tinh trong suốt gói trọn nhân tôm sú nguyên con giòn sần sật điểm lá vàng thực phẩm, hấp nóng trong xửng tre truyền thống.',
      kcal: '225 kcal',
      protein: '15.2 g',
      fat: '8.6 g',
      minerals: '240 mg',
      allergen: 'Giáp xác (Tôm), Lúa mì (Gluten), Dầu mè.',
      sauce: 'Xì dầu Hồng Kông pha giấm đỏ Tứ Xuyên, Sa tế sò điệp XO.'
    },
    {
      title: 'Lẩu Tomyum hải sản cay nồng',
      category: 'Lẩu & Tráng miệng',
      station: 'Quầy Lẩu & Nước Dùng — Line D1',
      status: 'Đang phục vụ • Phục vụ tại bàn',
      image: 'assets/figma/34b1e.png',
      gallery: [
        'assets/figma/34b1e.png',
        'assets/figma/8ab3d.png',
        'assets/figma/dd907.png',
        'assets/figma/6a5e7.png'
      ],
      desc: 'Nồi lẩu uyên ương 2 ngăn kết hợp nước cốt Tomyum Kung chua cay béo ngậy cốt dừa Thái Lan và nước lẩu nấm thiên nhiên thanh ngọt hầm xương 18 giờ.',
      kcal: '260 kcal',
      protein: '19.5 g',
      fat: '12.0 g',
      minerals: '430 mg',
      allergen: 'Giáp xác, Sữa dừa.',
      sauce: 'Sốt chấm lẩu Thái chua cay, Nước mắm nhĩ Phú Quốc ớt hiểm.'
    },
    {
      title: 'Bánh mousse chanh dây & kem Gelato Ý',
      category: 'Lẩu & Tráng miệng',
      station: 'Quầy Tráng Miệng & Trà Hoa — Line D3',
      status: 'Đang phục vụ • Làm lạnh 4°C',
      image: 'assets/figma/dd907.png',
      gallery: [
        'assets/figma/dd907.png',
        'assets/figma/6a5e7.png',
        'assets/figma/047a0.png',
        'assets/figma/4f793.png'
      ],
      desc: 'Bánh mousse chanh dây chua thanh mát lạnh kết hợp 8 vị kem Gelato thủ công kiểu Ý, chè dưỡng nhan tuyết yến và trái cây nhiệt đới theo mùa.',
      kcal: '240 kcal',
      protein: '4.8 g',
      fat: '11.5 g',
      minerals: '120 mg',
      allergen: 'Trứng, Sữa tươi, Lúa mì (Gluten).',
      sauce: 'Sốt coulis dâu tây & chanh dây tươi.'
    }
  ];

  function findDishRecord(title) {
    if (!title) return DISH_DATABASE[0];
    var q = title.toLowerCase();
    for (var i = 0; i < DISH_DATABASE.length; i++) {
      var d = DISH_DATABASE[i];
      if (d.title.toLowerCase() === q || d.title.toLowerCase().indexOf(q) !== -1 || q.indexOf(d.title.toLowerCase().slice(0, 10)) !== -1) {
        return d;
      }
    }
    return {
      title: title,
      category: 'Hải sản & Nướng thượng hạng',
      station: 'Quầy Hải Sản Bơi Bể & Bếp Mở — Line A1',
      status: 'Đang phục vụ • Chế biến trong ngày',
      image: 'assets/figma/46d9d.png',
      gallery: [
        'assets/figma/46d9d.png',
        'assets/figma/f1d84.png',
        'assets/figma/f0ea2.png',
        'assets/figma/16ace.png'
      ],
      desc: title + ' được bếp trưởng Oceania chế biến trực tiếp từ nguồn nguyên liệu tươi sống tuyển chọn mỗi sáng, giữ trọn hương vị biển khơi và độ ngọt tự nhiên.',
      kcal: '235 kcal',
      protein: '24.0 g',
      fat: '9.5 g',
      minerals: '470 mg',
      allergen: 'Hải sản có vỏ / Đậu nành trong gia vị ướp.',
      sauce: 'Sốt hải sản ớt xanh Nha Trang, Muối tiêu Phú Quốc vắt tắc tươi.'
    };
  }

  /* ==========================================================================
     3. STICKY HEADER GLASSMORPHISM, BACK-TO-TOP & ACTIVE NAV TAB
     ========================================================================== */
  function initStickyHeaderAndScroll() {
    var headers = document.querySelectorAll('[data-name="Navigation"], [data-name="Điều hướng"]');
    var backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'oceania-back-to-top';
    backBtn.setAttribute('aria-label', 'Lên đầu trang');
    backBtn.innerHTML = '↑';
    document.body.appendChild(backBtn);

    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function onScroll() {
      var y = window.scrollY || window.pageYOffset || 0;
      headers.forEach(function (h) {
        if (y > 24) {
          h.classList.add('oceania-header-glass');
        } else {
          h.classList.remove('oceania-header-glass');
        }
      });
      if (y > 380) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Highlight current page in Navigation */
    var path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var navMatchMap = {
      'index.html': 'trang chủ',
      'about.html': 'giới thiệu',
      'menu.html': 'thực đơn',
      'pricing.html': 'bảng giá',
      'promotions.html': 'ưu đãi',
      'blog.html': 'cẩm nang',
      'post-detail.html': 'cẩm nang',
      'locations.html': 'chi nhánh',
      'careers.html': 'tuyển dụng',
      'reviews.html': 'oceania club',
      'booking-lookup.html': 'tra cứu'
    };
    var targetKey = navMatchMap[path] || '';
    if (targetKey) {
      document.querySelectorAll('[data-name="Navigation item"], [data-name="Tuyển dụng"]').forEach(function (item) {
        var txt = getText(item).toLowerCase();
        if (txt.indexOf(targetKey) !== -1) {
          item.classList.add('oceania-nav-active');
        }
      });
    }
  }

  /* ==========================================================================
     4. HEADER LIVE SEARCH AUTOCOMPLETE (DESKTOP + S11 DRAWER + S22 MOBILE)
     ========================================================================== */
  function initGlobalSearchAutocomplete() {
    var searchDrawer = document.getElementById('oceania-search-drawer');
    var searchInputs = document.querySelectorAll('.oceania-header-search-input, #oceania-drawer-search-input');
    var mobileSearchInp = document.getElementById('oceania-mobile-search-input');
    var mobileResultsBox = document.getElementById('oceania-mobile-search-results');

    var liveResultsBox = null;
    if (searchDrawer) {
      liveResultsBox = document.createElement('div');
      liveResultsBox.id = 'oceania-live-autocomplete-list';
      liveResultsBox.style.cssText = 'max-width:1280px;margin:0 auto;padding:18px 40px 24px;background:#ffffff;border-top:1px solid #e2e8f0;';
      searchDrawer.appendChild(liveResultsBox);
    }

    function renderAutocompleteItems(query, targetBox, limitCount) {
      if (!targetBox) return;
      var q = (query || '').trim().toLowerCase();
      var matches = DISH_DATABASE.filter(function (d) {
        if (!q) return true;
        return d.title.toLowerCase().indexOf(q) !== -1 || d.category.toLowerCase().indexOf(q) !== -1 || d.station.toLowerCase().indexOf(q) !== -1;
      }).slice(0, limitCount || 8);

      var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px;flex-wrap:wrap;">' +
        '<p style="font-size:12px;font-weight:700;color:#ff5a36;letter-spacing:1.1px;text-transform:uppercase;">' +
        (q ? ('KẾT QUẢ CHO "' + query + '" (' + matches.length + ' MÓN)') : '12 MÓN ĐANG PHỤC VỤ TẠI QUẦY LINE') +
        '</p>' +
        '<a href="menu.html' + (q ? ('?q=' + encodeURIComponent(query)) : '') + '" style="font-size:12px;font-weight:600;color:#07192f;text-decoration:underline;">Xem toàn bộ 50+ món →</a>' +
        '</div>';

      if (matches.length === 0) {
        html += '<p style="font-size:13px;color:#64748b;padding:8px 0;">Không tìm thấy món ăn khớp từ khóa. Gợi ý: Tôm hùm bông, Cua Cà Mau, Bò Wagyu, Sashimi, Lẩu Tomyum...</p>';
      } else {
        html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px;">';
        matches.forEach(function (dish) {
          html += '<a href="menu.html?q=' + encodeURIComponent(dish.title) + '" ' +
            'style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:#f8f9fa;border:1px solid #e2e8f0;border-radius:6px;text-decoration:none;color:#1e293b;">' +
            '<img src="' + dish.image + '" alt="' + dish.title + '" style="width:48px;height:40px;object-fit:cover;border-radius:4px;flex-shrink:0;"/>' +
            '<div style="min-width:0;flex:1;">' +
            '<p style="font-size:13px;font-weight:600;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + dish.title + '</p>' +
            '<p style="font-size:11px;color:#0d9488;font-weight:600;">● ' + dish.status + '</p>' +
            '</div>' +
            '</a>';
        });
        html += '</div>';
      }
      targetBox.innerHTML = html;
    }

    window.OceaniaRenderSearch = function (q) {
      renderAutocompleteItems(q || '', liveResultsBox, 8);
    };

    searchInputs.forEach(function (inp) {
      inp.addEventListener('focus', function () {
        if (searchDrawer) {
          searchDrawer.classList.add('open');
          renderAutocompleteItems(inp.value, liveResultsBox, 8);
        }
      });
      inp.addEventListener('input', function () {
        var val = inp.value;
        searchInputs.forEach(function (other) { if (other !== inp) other.value = val; });
        if (searchDrawer) {
          searchDrawer.classList.add('open');
          renderAutocompleteItems(val, liveResultsBox, 8);
        }
      });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var q = inp.value.trim();
          window.location.href = 'menu.html' + (q ? '?q=' + encodeURIComponent(q) : '');
        } else if (e.key === 'Escape') {
          if (searchDrawer) searchDrawer.classList.remove('open');
        }
      });
    });

    if (mobileSearchInp && mobileResultsBox) {
      mobileSearchInp.addEventListener('input', function () {
        var q = mobileSearchInp.value.trim();
        if (!q) {
          mobileResultsBox.innerHTML = '';
          return;
        }
        renderAutocompleteItems(q, mobileResultsBox, 4);
      });
      mobileSearchInp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var q = mobileSearchInp.value.trim();
          window.location.href = 'menu.html' + (q ? '?q=' + encodeURIComponent(q) : '');
        }
      });
    }

    if (searchDrawer) {
      renderAutocompleteItems('', liveResultsBox, 8);
      searchDrawer.addEventListener('click', function (e) {
        if (e.target.closest('a, input')) return;
        var btn = e.target.closest('[data-name*="Từ khóa"], [data-name*="Gợi ý"], [data-name*="Món"], [data-name*="Action"], [data-name*="Nút"], [data-node-id="3375:38961"]');
        if (!btn) return;
        var txt = getText(btn);
        if (txt.indexOf('Đóng') !== -1 || txt === '✕' || txt === '×') {
          searchDrawer.classList.remove('open');
          return;
        }
        if (txt.indexOf('Xem toàn bộ') !== -1 || txt.indexOf('Xem tất cả') !== -1) {
          window.location.href = 'menu.html';
          return;
        }
        if (btn.getAttribute('data-name') && btn.getAttribute('data-name').indexOf('Từ khóa') !== -1) {
          var kw = txt.replace(/^#/, '').trim();
          var drawerInp = document.getElementById('oceania-drawer-search-input');
          if (drawerInp) drawerInp.value = kw;
          renderAutocompleteItems(kw, liveResultsBox, 8);
          return;
        }
        var dishTitle = txt.split('•')[0].trim();
        if (dishTitle) {
          window.location.href = 'menu.html?q=' + encodeURIComponent(dishTitle);
        }
      });
    }
  }

  /* ==========================================================================
     5. GLOBAL CLICK ROUTER (NAVIGATION, SEARCH, DRAWERS, CHECKBOXES, MODALS)
     ========================================================================== */
  function initGlobalClickRouter() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.oceania-modal-overlay.open').forEach(function (m) { m.classList.remove('open'); });
        var sd = document.getElementById('oceania-search-drawer');
        if (sd) sd.classList.remove('open');
        var md = document.getElementById('oceania-mobile-drawer');
        if (md) md.classList.remove('open');
      }
    });

    document.addEventListener('click', function (e) {
      /* Close modal when clicking backdrop or close buttons */
      if (e.target.classList && e.target.classList.contains('oceania-modal-overlay')) {
        e.target.classList.remove('open');
        return;
      }
      if (e.target.closest('#oceania-lightbox-close, .oceania-modal-close')) {
        var om = e.target.closest('.oceania-modal-overlay');
        if (om) om.classList.remove('open');
        return;
      }

      /* Mobile / Tablet search icon click opens live search drawer */
      var searchDrawer = document.getElementById('oceania-search-drawer');
      var searchIcon = e.target.closest('[data-name="search"], [data-name="Search"], [data-name="Nút tìm kiếm"]');
      if (searchIcon && !e.target.closest('#oceania-search-drawer')) {
        if (searchDrawer) {
          searchDrawer.classList.toggle('open');
          if (searchDrawer.classList.contains('open')) {
            if (window.OceaniaRenderSearch) window.OceaniaRenderSearch('');
            var dInp = document.getElementById('oceania-drawer-search-input');
            if (dInp) setTimeout(function () { dInp.focus(); }, 60);
          }
          return;
        }
      }

      /* Close search drawer when clicking outside header/drawer */
      if (searchDrawer && searchDrawer.classList.contains('open')) {
        if (!e.target.closest('#oceania-search-drawer') && !e.target.closest('[data-name="search"], [data-name="Search"]') && !e.target.closest('[data-name*="tìm kiếm"]') && !e.target.closest('.oceania-header-search-input')) {
          searchDrawer.classList.remove('open');
        }
      }

      /* Mobile / Tablet menu drawer open/close */
      var mobDrawer = document.getElementById('oceania-mobile-drawer');
      var mobTrigger = e.target.closest('[data-name="menu"], [data-name="Nút menu"], [data-name="Menu"], [data-node-id="3375:36593"], [data-node-id="3504:2057"]');
      if (mobTrigger && mobDrawer) {
        mobDrawer.classList.toggle('open');
        return;
      }
      if (mobDrawer && mobDrawer.classList.contains('open')) {
        var closeBtn = e.target.closest('[data-name="Nút đóng"], [data-node-id="3375:39481"], [data-node-id="3375:39494"]');
        if (closeBtn || (!e.target.closest('#oceania-mobile-drawer > div') && !e.target.closest('[data-name="menu"], [data-name="Nút menu"], [data-name="Menu"]'))) {
          mobDrawer.classList.remove('open');
          return;
        }
      }

      /* Interactive Checkbox Toggle (☐ <-> ☑) inside Forms */
      var chkNode = e.target.closest('p, div');
      if (chkNode && !chkNode.hasAttribute('data-oceania-handled') && !e.target.closest('input, select, textarea, a[href]')) {
        var directTxt = chkNode.tagName === 'P' ? getText(chkNode) : '';
        if (directTxt && (directTxt.charAt(0) === '☐' || directTxt.charAt(0) === '☑') && !chkNode.closest('#booking-step-3, #booking-step-3-error')) {
          var isChecked = directTxt.charAt(0) === '☑';
          chkNode.textContent = (isChecked ? '☐' : '☑') + directTxt.slice(1);
          chkNode.style.color = isChecked ? '#64748b' : '#07192f';
          return;
        }
      }

      /* Policy Modal Link Interception in Footer */
      var policyTrigger = e.target.closest('[data-name="Footer"] p, [data-name="Chân trang"] p');
      if (policyTrigger && !e.target.closest('input')) {
        var pTxt = getText(policyTrigger).toLowerCase();
        if (pTxt.indexOf('điều khoản') !== -1 || pTxt.indexOf('chính sách bảo mật') !== -1 || pTxt.indexOf('an toàn thực phẩm') !== -1) {
          openModal('oceania-policy-modal');
          return;
        }
      }

      /* Global Header / Footer / Drawer / Sticky Bottom Bar / CTA Navigation Items */
      var navItem = e.target.closest(
        '[data-name="Navigation item"], [data-name="Tuyển dụng"], [data-name="Mục menu"], ' +
        '[data-name="Oceania wordmark"], [data-name="Logo"], ' +
        '[data-name="Booking action"], [data-name="Nút đặt bàn"], ' +
        '[data-name="Consultation action"], [data-name="Nút tư vấn"], ' +
        '[data-name="Truy cập đặt bàn"], ' +
        '[data-name="Thanh hành động"] [data-name*="Nút"], [data-name="Thanh hành động"] p, ' +
        '[data-name="Guest services"] p, [data-name="Dịch vụ khách"] p, ' +
        '[data-name="Footer"] p, [data-name="Chân trang"] p'
      );
      if (navItem && !navItem.hasAttribute('data-oceania-handled') && !e.target.closest('input, select, textarea, a[href]')) {
        var navTxt = getText(navItem).toLowerCase();
        var nameAttr = (navItem.getAttribute('data-name') || '').toLowerCase();
        if (nameAttr.indexOf('wordmark') !== -1 || nameAttr === 'logo' || navTxt === 'trang chủ') {
          window.location.href = 'index.html';
          return;
        }
        if (navTxt === 'giới thiệu' || navTxt.indexOf('câu chuyện thương hiệu') !== -1 || navTxt.indexOf('không gian & bể hải sản') !== -1) {
          window.location.href = 'about.html';
          return;
        }
        if (navTxt === 'thực đơn' || navTxt.indexOf('thực đơn 50+ món') !== -1 || navTxt.indexOf('xem toàn bộ thực đơn') !== -1 || navTxt === 'xem thực đơn') {
          window.location.href = 'menu.html';
          return;
        }
        if (navTxt === 'bảng giá' || navTxt.indexOf('bảng giá buffet') !== -1 || navTxt === 'xem bảng giá') {
          window.location.href = 'pricing.html';
          return;
        }
        if (navTxt.indexOf('ưu đãi') !== -1) {
          window.location.href = 'promotions.html';
          return;
        }
        if (navTxt === 'cẩm nang' || navTxt.indexOf('cẩm nang ẩm thực') !== -1) {
          window.location.href = 'blog.html';
          return;
        }
        if (navTxt === 'chi nhánh' || navTxt.indexOf('hệ thống chi nhánh') !== -1) {
          window.location.href = 'locations.html';
          return;
        }
        if (navTxt.indexOf('tuyển dụng') !== -1) {
          window.location.href = 'careers.html';
          return;
        }
        if (navTxt.indexOf('tra cứu đặt bàn') !== -1 || navTxt.indexOf('tra cứu vé') !== -1 || navTxt === 'tra cứu') {
          window.location.href = 'booking-lookup.html';
          return;
        }
        if (navTxt.indexOf('oceania club') !== -1 || navTxt.indexOf('đánh giá & thẻ thành viên') !== -1) {
          window.location.href = 'reviews.html';
          return;
        }
        if (nameAttr.indexOf('booking action') !== -1 || nameAttr.indexOf('nút đặt bàn') !== -1 || navTxt === 'đặt bàn' || navTxt.indexOf('đặt bàn ngay') !== -1) {
          window.location.href = 'booking.html';
          return;
        }
        if (nameAttr.indexOf('consultation action') !== -1 || nameAttr.indexOf('nút tư vấn') !== -1 || navTxt === 'tư vấn') {
          window.location.href = 'locations.html#oceania-contact-wrapper';
          return;
        }
      }

      /* Newsletter submit in Footer & Blog Sidebar (Desktop + Tablet + Mobile) */
      var newsBtn = e.target.closest(
        '[data-name="Newsletter form"] [data-name="Subscribe"], ' +
        '[data-name="Form nhận tin"] [data-name="Nút đăng ký"], ' +
        '[data-name="Bản tin"] [data-name="Nút hành động"], ' +
        '[data-name="Bản tin"] [data-name="Nút gửi"], ' +
        '[data-node-id="3346:336"], [data-node-id="3361:13493"]'
      );
      if (!newsBtn) {
        var bCand = e.target.closest('[data-name="Nút hành động"], [data-name*="Nút"]');
        if (bCand && bCand.closest('[data-name="Bản tin"], [data-name="Newsletter form"]')) {
          newsBtn = bCand;
        }
      }
      if (newsBtn) {
        e.preventDefault();
        var wrap = newsBtn.closest('[data-name="Newsletter form"], [data-name="Form nhận tin"], [data-name="Bản tin"]') || newsBtn.parentElement;
        var emailInp = wrap ? wrap.querySelector('input') : null;
        var val = emailInp ? emailInp.value.trim() : '';
        if (!val || val.indexOf('@') === -1 || val.indexOf('.') === -1) {
          showToast('Vui lòng nhập địa chỉ email hợp lệ (VD: ten@gmail.com) để nhận voucher Oceania Club.');
          if (emailInp) emailInp.focus();
        } else {
          showToast('Đăng ký thành công! Mã voucher giảm 10% OCN-WELCOME đã được gửi tới ' + val);
          if (emailInp) emailInp.value = '';
        }
        return;
      }

      /* Dish Card click -> on menu.html open quick lightbox preview; on other pages go to menu.html?q=... */
      var dishCard = e.target.closest('[data-name="Featured dish"], [data-name="Dish card"], [data-name="Món ăn"], [data-name="Món phù hợp"]');
      if (dishCard && !e.target.closest('input, select, textarea, a[href]')) {
        var ps = dishCard.querySelectorAll('p');
        var dishName = '';
        for (var i = 0; i < ps.length; i++) {
          var t = getText(ps[i]);
          if (t.length > 6 && t.indexOf('Quầy') === -1 && t.indexOf('Đang phục vụ') === -1 && t.indexOf('Bắt sống') === -1 && t.indexOf('Món ') === -1 && t.indexOf('Xem ') === -1 && t.indexOf('Yêu thích') === -1 && t.indexOf('Bán chạy') === -1 && t.indexOf('Không giới hạn') === -1 && t.indexOf('Ra món') === -1) {
            dishName = t;
            break;
          }
        }
        if (dishName) {
          var curPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
          if (curPage === 'menu.html') {
            var rec = findDishRecord(dishName);
            var lbImg = document.getElementById('oceania-lightbox-img');
            var lbTitle = document.getElementById('oceania-lightbox-title');
            var lbCap = document.getElementById('oceania-lightbox-caption');
            var cardImg = dishCard.querySelector('img');
            if (lbImg) lbImg.src = (cardImg && cardImg.getAttribute('src')) ? cardImg.getAttribute('src') : rec.image;
            if (lbTitle) lbTitle.textContent = dishName;
            if (lbCap) lbCap.textContent = rec.station + ' — ' + rec.desc;
            openModal('oceania-lightbox-modal');
          } else {
            window.location.href = 'menu.html?q=' + encodeURIComponent(dishName);
          }
          return;
        }
      }

      /* Blog Card click -> post-detail.html?post=... */
      var blogCard = e.target.closest('[data-name="Bài viết"], [data-name="Featured story"], [data-name="Article card"]');
      if (blogCard) {
        var bps = blogCard.querySelectorAll('p');
        var postTitle = '';
        for (var j = 0; j < bps.length; j++) {
          var bt = getText(bps[j]);
          if (bt.length > 18 && bt.indexOf(' phút đọc') === -1 && bt.indexOf('Đọc bài') === -1 && bt.indexOf('BÀI VIẾT') === -1) {
            postTitle = bt;
            break;
          }
        }
        if (postTitle) {
          window.location.href = 'post-detail.html?post=' + encodeURIComponent(postTitle);
          return;
        }
      }

      /* Branch Card CTA click -> booking.html?branch=... or locations.html */
      var branchCard = e.target.closest('[data-name="Branch"], [data-name="Chi nhánh"]');
      if (branchCard && e.target.closest('[data-name*="Action"], [data-name*="Nút"], [data-name*="Button"]')) {
        var bText = getText(branchCard);
        var bKey = 'Vincom Đồng Khởi Q1';
        if (bText.indexOf('Lotte') !== -1 || bText.indexOf('Quận 7') !== -1 || bText.indexOf('Q7') !== -1) bKey = 'Lotte Mart Q7';
        else if (bText.indexOf('Cantavil') !== -1 || bText.indexOf('Thủ Đức') !== -1) bKey = 'Cantavil Thủ Đức';
        var btnText = getText(e.target.closest('[data-name*="Action"], [data-name*="Nút"], [data-name*="Button"]'));
        if (btnText.indexOf('bản đồ') !== -1 || btnText.indexOf('Chỉ đường') !== -1) {
          window.location.href = 'locations.html?branch=' + encodeURIComponent(bKey);
        } else {
          window.location.href = 'booking.html?branch=' + encodeURIComponent(bKey);
        }
        return;
      }

      /* Explicit [data-oceania-link] navigation */
      var linkNode = e.target.closest('[data-oceania-link]');
      if (linkNode) {
        if (linkNode.hasAttribute('data-oceania-handled')) return;
        var href = linkNode.getAttribute('data-oceania-link');
        if (href) {
          window.location.href = href;
          return;
        }
      }

      /* Universal Fallback for any remaining Figma <a:not([href])> or CTA buttons */
      var ctaFallback = e.target.closest('a:not([href]), button[data-node-id], [data-name="Action"], [data-name="Primary action"], [data-name="Secondary action"], [data-name="Nút hành động"], [data-name="Nút chính"], [data-name="Nút phụ"]');
      if (ctaFallback && !ctaFallback.hasAttribute('data-oceania-handled') && !e.target.closest('input, select, textarea, a[href], #oceania-booking-wizard, #oceania-lookup-results, #oceania-lookup-section')) {
        var cTxt = getText(ctaFallback).toLowerCase();
        if (cTxt.indexOf('tìm bàn trống') !== -1 || cTxt.indexOf('đặt bàn') !== -1 || cTxt.indexOf('đặt lịch') !== -1) {
          window.location.href = 'booking.html';
        } else if (cTxt.indexOf('khám phá thực đơn') !== -1 || cTxt.indexOf('xem thực đơn') !== -1 || cTxt.indexOf('50+ món') !== -1) {
          window.location.href = 'menu.html';
        } else if (cTxt.indexOf('khám phá oceania') !== -1 || cTxt.indexOf('câu chuyện') !== -1 || cTxt.indexOf('giới thiệu') !== -1) {
          window.location.href = 'about.html';
        } else if (cTxt.indexOf('bảng giá') !== -1 || cTxt.indexOf('chính sách') !== -1) {
          window.location.href = 'pricing.html';
        } else if (cTxt.indexOf('tư vấn') !== -1) {
          window.location.href = 'promotions.html#party-consultation-section';
        } else if (cTxt.indexOf('xem chi nhánh') !== -1 || cTxt.indexOf('tất cả cơ sở') !== -1 || cTxt.indexOf('bản đồ') !== -1) {
          window.location.href = 'locations.html';
        } else if (cTxt.indexOf('tuyển dụng') !== -1) {
          window.location.href = 'careers.html';
        } else if (cTxt.indexOf('tra cứu') !== -1) {
          window.location.href = 'booking-lookup.html';
        } else if (cTxt.indexOf('cẩm nang') !== -1 || cTxt.indexOf('đọc tất cả') !== -1) {
          window.location.href = 'blog.html';
        } else if (cTxt.indexOf('ưu đãi') !== -1) {
          window.location.href = 'promotions.html';
        } else if (cTxt.indexOf('oceania club') !== -1 || cTxt.indexOf('đánh giá') !== -1) {
          window.location.href = 'reviews.html';
        }
      }
    });
  }

  /* ==========================================================================
     6. HOMEPAGE (index.html): HERO SLIDER (D/T/M), QUICK-BAR, TAB FILTER
     ========================================================================== */
  function initHomepage() {
    var heroSlides = [
      {
        label: '01 / 03 · Hải sản bơi bể',
        titleLine1: 'Tinh hoa biển cả —',
        titleLine2: 'Bùng vị lửa hồng',
        desc: 'Hải sản tươi ngon, BBQ nướng than hồng và những cuộc sum vầy trọn vị. Hẹn nhau tại Oceania Seafood & BBQ Buffet, chỉ tại TP.HCM.',
        img: 'assets/figma/349d8.png'
      },
      {
        label: '02 / 03 · Bò Wagyu nướng than',
        titleLine1: 'Thăn ngoại Wagyu —',
        titleLine2: 'Nướng than Binchotan',
        desc: 'Thịt bò vân mỡ cẩm thạch MBS 6-7 áp chảo trên đá muối hồng Himalaya và nướng than Binchotan Nhật Bản không khói, giữ trọn vị ngọt mọng nước.',
        img: 'assets/figma/f0ea2.png'
      },
      {
        label: '03 / 03 · Không gian đại dương',
        titleLine1: 'Sảnh kính đại dương —',
        titleLine2: 'Phòng tiệc VIP riêng tư',
        desc: 'Hệ thống 3 cơ sở trung tâm TP.HCM (Vincom Q1, Lotte Mart Q7, Cantavil Thủ Đức) với bể hải sản tràn bờ 18m và phòng tiệc VIP từ 10–60 khách.',
        img: 'assets/figma/da2f6.png'
      }
    ];

    /* 6.1 Desktop Hero Slider */
    var heroFrame = document.querySelector('.oceania-desktop-view [data-node-id="3346:33"]');
    if (heroFrame) {
      var currentSlide = 0;
      var heroImg = heroFrame.querySelector('img');
      var heroTitleWrap = heroFrame.querySelector('[data-node-id="3346:39"]');
      var heroDesc = heroFrame.querySelector('[data-node-id="3346:40"]');
      var topicTabs = heroFrame.querySelectorAll('[data-name="Slide topic"]');

      function applyHeroSlide(idx) {
        currentSlide = (idx + heroSlides.length) % heroSlides.length;
        var s = heroSlides[currentSlide];
        if (heroImg) {
          heroImg.style.opacity = '0.4';
          setTimeout(function () {
            heroImg.src = s.img;
            heroImg.style.opacity = '1';
          }, 160);
        }
        if (heroTitleWrap) {
          var tps = heroTitleWrap.querySelectorAll('p');
          if (tps.length >= 2) {
            tps[0].textContent = s.titleLine1;
            tps[1].textContent = s.titleLine2;
          }
        }
        if (heroDesc) heroDesc.textContent = s.desc;
        topicTabs.forEach(function (tab, tIdx) {
          tab.style.borderTopColor = tIdx === currentSlide ? '#d4af37' : '#ffffff';
          tab.style.borderTopWidth = tIdx === currentSlide ? '2px' : '1px';
          var btn = tab.querySelector('button, p');
          if (btn) btn.style.color = tIdx === currentSlide ? '#f8f9fa' : '#c3c9c8';
        });
      }

      topicTabs.forEach(function (tab, idx) {
        tab.style.cursor = 'pointer';
        tab.addEventListener('click', function () { applyHeroSlide(idx); });
      });
      var prevBtn = heroFrame.querySelector('[data-name="Previous"], [data-node-id="3375:25"]');
      var nextBtn = heroFrame.querySelector('[data-name="Next"], [data-node-id="3375:28"]');
      if (prevBtn) { prevBtn.style.cursor = 'pointer'; prevBtn.addEventListener('click', function () { applyHeroSlide(currentSlide - 1); }); }
      if (nextBtn) { nextBtn.style.cursor = 'pointer'; nextBtn.addEventListener('click', function () { applyHeroSlide(currentSlide + 1); }); }
      setInterval(function () { applyHeroSlide(currentSlide + 1); }, 6500);
    }

    /* 6.1B Tablet & Mobile Hero Sliders ([data-name="Điều khiển ảnh"]) */
    document.querySelectorAll('.oceania-tablet-view [data-name="Mở đầu"], .oceania-mobile-view [data-name="Mở đầu"], .oceania-tablet-view [data-name="Mở đầu trang"], .oceania-mobile-view [data-name="Mở đầu trang"]').forEach(function (tmHero) {
      var tmIdx = 0;
      var tmImg = tmHero.querySelector('img');
      var ctrlWrap = tmHero.querySelector('[data-name="Điều khiển ảnh"]');
      if (!ctrlWrap) return;
      var btns = Array.from(ctrlWrap.querySelectorAll('button'));
      var lblBtn = btns.find(function (b) { var t = getText(b); return t.indexOf('/') !== -1 || t.length > 3; }) || null;
      var lblEl = lblBtn ? (lblBtn.querySelector('p') || lblBtn) : ctrlWrap.querySelector('p');
      var pBtn = ctrlWrap.querySelector('[data-node-id="3504:2075"], [data-node-id="3375:36609"]') || btns.find(function (b) { return getText(b).indexOf('←') !== -1; });
      var nBtn = ctrlWrap.querySelector('[data-node-id="3504:3993"], [data-node-id="3504:3988"]') || btns.find(function (b) { return getText(b).indexOf('→') !== -1; });
      var titleEl = tmHero.querySelector('[data-node-id="3504:2063"] p, [data-node-id="3375:36600"] p');
      var descEl = tmHero.querySelector('[data-node-id="3504:2064"] p, [data-node-id="3375:36601"] p');

      function applyTmSlide(idx) {
        tmIdx = (idx + heroSlides.length) % heroSlides.length;
        var s = heroSlides[tmIdx];
        if (tmImg) tmImg.src = s.img;
        if (lblEl) lblEl.textContent = s.label;
        if (titleEl) titleEl.textContent = s.titleLine1 + ' ' + s.titleLine2;
        if (descEl) descEl.textContent = s.desc;
      }
      if (lblBtn) lblBtn.addEventListener('click', function () { applyTmSlide(tmIdx + 1); });
      if (pBtn) { pBtn.setAttribute('data-oceania-handled', '1'); pBtn.addEventListener('click', function (e) { e.stopPropagation(); applyTmSlide(tmIdx - 1); }); }
      if (nBtn) { nBtn.setAttribute('data-oceania-handled', '1'); nBtn.addEventListener('click', function (e) { e.stopPropagation(); applyTmSlide(tmIdx + 1); }); }
    });

    /* 6.2 Fast Booking Quick-Bar -> booking.html (Desktop + Tablet + Mobile) */
    document.querySelectorAll('[data-node-id="3346:81"], [data-node-id="3504:2087"], [data-node-id="3375:36621"], [data-name="Đặt bàn nhanh"] [data-name="Nút hành động"]').forEach(function (quickBtn) {
      quickBtn.setAttribute('data-oceania-handled', '1');
      quickBtn.style.cursor = 'pointer';
      quickBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var scope = quickBtn.closest('[data-name="Đặt bàn nhanh"], [data-name="Quick booking"], [data-node-id="3346:55"], [data-node-id="3504:2077"], [data-node-id="3375:36611"]') || quickBtn.parentElement;
        var branchEl = scope ? scope.querySelector('[data-oceania-field="quick-branch"]') : document.getElementById('quick-branch');
        var dateEl = scope ? scope.querySelector('[data-oceania-field="quick-date"]') : document.getElementById('quick-date');
        var shiftEl = scope ? scope.querySelector('[data-oceania-field="quick-shift"]') : document.getElementById('quick-shift');
        var guestsEl = scope ? scope.querySelector('[data-oceania-field="quick-guests"]') : document.getElementById('quick-guests');
        var params = new URLSearchParams();
        if (branchEl) params.set('branch', branchEl.value);
        if (dateEl) params.set('date', dateEl.value);
        if (shiftEl) params.set('shift', shiftEl.value);
        if (guestsEl) params.set('guests', guestsEl.value);
        window.location.href = 'booking.html?' + params.toString();
      });
    });

    /* 6.3 Homepage Category Tab Filter (50+ dishes preview across D/T/M) */
    document.querySelectorAll('[data-node-id="3346:121"], .oceania-tablet-view [data-name="Thanh tab"], .oceania-mobile-view [data-name="Thanh tab"]').forEach(function (homeTabsWrap) {
      var sectionScope = homeTabsWrap.parentElement || document;
      var homeDishesGrid = document.querySelector('[data-node-id="3346:132"]');
      var dishCards = homeTabsWrap.closest('.oceania-desktop-view') && homeDishesGrid
        ? homeDishesGrid.querySelectorAll('[data-name="Featured dish"], [data-name="Dish card"]')
        : (sectionScope.parentElement || document).querySelectorAll('[data-name="Món ăn"], [data-name="Featured dish"], [data-name="Dish card"]');

      var tabBtns = Array.from(homeTabsWrap.children);
      tabBtns.forEach(function (btn) {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function () {
          var cat = getText(btn).toLowerCase();
          tabBtns.forEach(function (sib) {
            sib.style.backgroundColor = '#ffffff';
            sib.style.borderColor = '#e2e8f0';
            var sp = sib.querySelector('p');
            if (sp) sp.style.color = '#1e293b';
          });
          btn.style.backgroundColor = '#07192f';
          btn.style.borderColor = '#d4af37';
          var bp = btn.querySelector('p');
          if (bp) bp.style.color = '#f8f9fa';

          dishCards.forEach(function (card) {
            var cardText = getText(card).toLowerCase();
            var match = true;
            if (cat.indexOf('tất cả') !== -1) {
              match = true;
            } else if (cat.indexOf('cua') !== -1 || cat.indexOf('ghẹ') !== -1 || cat.indexOf('bơi bể') !== -1 || cat.indexOf('hải sản') !== -1) {
              match = cardText.indexOf('cua') !== -1 || cardText.indexOf('tôm') !== -1 || cardText.indexOf('hàu') !== -1 || cardText.indexOf('ghẹ') !== -1 || cardText.indexOf('bào ngư') !== -1;
            } else if (cat.indexOf('bò') !== -1 || cat.indexOf('nướng') !== -1 || cat.indexOf('bbq') !== -1) {
              match = cardText.indexOf('bò') !== -1 || cardText.indexOf('sườn') !== -1 || cardText.indexOf('wagyu') !== -1 || cardText.indexOf('nướng') !== -1;
            } else if (cat.indexOf('dimsum') !== -1 || cat.indexOf('sashimi') !== -1) {
              match = cardText.indexOf('sashimi') !== -1 || cardText.indexOf('cá hồi') !== -1 || cardText.indexOf('há cảo') !== -1 || cardText.indexOf('bào ngư') !== -1;
            } else if (cat.indexOf('lẩu') !== -1 || cat.indexOf('tráng miệng') !== -1) {
              match = cardText.indexOf('lẩu') !== -1 || cardText.indexOf('bánh') !== -1 || cardText.indexOf('kem') !== -1 || cardText.indexOf('tomyum') !== -1 || cardText.indexOf('hàu') !== -1;
            }
            card.style.display = match ? '' : 'none';
            if (match) {
              card.classList.remove('oceania-fade-in');
              void card.offsetWidth;
              card.classList.add('oceania-fade-in');
            }
          });
        });
      });
    });
  }

  /* ==========================================================================
     6B. ABOUT PAGE (about.html) & PHOTO LIGHTBOX GALLERY CONTROLLER
     ========================================================================== */
  function initLightboxGallery() {
    var lbModal = document.getElementById('oceania-lightbox-modal');
    if (!lbModal) return;
    var lbImg = document.getElementById('oceania-lightbox-img');
    var lbTitle = document.getElementById('oceania-lightbox-title');
    var lbCap = document.getElementById('oceania-lightbox-caption');
    var lbPrev = document.getElementById('oceania-lightbox-prev');
    var lbNext = document.getElementById('oceania-lightbox-next');

    var slides = [
      { img: 'assets/figma/da2f6.png', title: 'Sảnh Tiệc Đại Dương — Vincom Đồng Khởi Q1', cap: 'Sức chứa 180 thực khách với kiến trúc vòm sóng biển và bàn đá cẩm thạch sang trọng.' },
      { img: 'assets/figma/f1d84.png', title: 'Bể Hải Sản Kính Tràn Bờ Dài 18 Mét', cap: 'Cua Cà Mau, Tôm hùm bông, Ghẹ xanh bơi sống tự nhiên, thực khách chọn trực tiếp.' },
      { img: 'assets/figma/f0ea2.png', title: 'Khu Bếp Mở Nướng Than Binchotan Không Khói', cap: 'Hệ thống hút âm hiện đại nhập khẩu Nhật Bản giúp thực khách thoải mái thưởng thức BBQ không ám mùi.' },
      { img: 'assets/figma/349d8.png', title: 'Quầy Hải Sản Sốt Trứng Muối & Đút Lò Phô Mai', cap: 'Hơn 50+ món ngon được châm đầy liên tục mỗi 10 phút suốt ca phục vụ.' }
    ];
    var lbIdx = 0;

    function showSlide(i) {
      lbIdx = (i + slides.length) % slides.length;
      if (lbImg) lbImg.src = slides[lbIdx].img;
      if (lbTitle) lbTitle.textContent = slides[lbIdx].title;
      if (lbCap) lbCap.textContent = slides[lbIdx].cap;
    }

    if (lbPrev) lbPrev.addEventListener('click', function () { showSlide(lbIdx - 1); });
    if (lbNext) lbNext.addEventListener('click', function () { showSlide(lbIdx + 1); });

    document.querySelectorAll('[data-name="Gallery item"], [data-name="Thẻ không gian"], [data-name="Không gian"] img, [data-name="Bộ sưu tập"] img, [data-name="Ảnh không gian"], [data-name="Ảnh trải nghiệm"], [data-name="Tiệc biển"], [data-node-id="3375:351"], [data-name="Video trải nghiệm thực tế"]').forEach(function (el) {
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', function (e) {
        var imgEl = el.tagName === 'IMG' ? el : el.querySelector('img');
        if (imgEl && imgEl.getAttribute('src')) {
          var src = imgEl.getAttribute('src');
          var matched = -1;
          slides.forEach(function (s, idx) { if (src.indexOf(s.img) !== -1) matched = idx; });
          if (matched !== -1) {
            showSlide(matched);
          } else {
            if (lbImg) lbImg.src = src;
            var p = el.closest('[data-node-id]') ? el.closest('[data-node-id]').querySelector('p') : null;
            if (lbTitle) lbTitle.textContent = p ? getText(p) : 'Không gian & Trải nghiệm Oceania Buffet';
            if (lbCap) lbCap.textContent = 'Trải nghiệm thực tế tại hệ thống Oceania Seafood & BBQ Buffet TP.HCM.';
          }
          openModal('oceania-lightbox-modal');
          e.stopPropagation();
        }
      });
    });
  }

  /* ==========================================================================
     7. MENU (menu.html): REALTIME SEARCH, CATEGORY TABS & TASTE PILLS
     ========================================================================== */
  function initMenuPage() {
    var searchInputs = document.querySelectorAll('#menu-search-input, [data-oceania-field="menu-search"]');
    var searchInp = searchInputs[0] || null;
    var allDishCards = document.querySelectorAll('.oceania-desktop-view [data-name="Món ăn"], .oceania-tablet-view [data-name="Món ăn"], .oceania-mobile-view [data-name="Món ăn"]');
    if (searchInputs.length === 0 && allDishCards.length === 0) return;

    var activeCategory = 'all';
    var activeTaste = 'all';
    var activeQuery = '';

    function filterMenuCards() {
      var q = (activeQuery || '').trim().toLowerCase();
      var visibleCount = 0;

      allDishCards.forEach(function (card) {
        var text = getText(card).toLowerCase();
        var matchSearch = !q || text.indexOf(q) !== -1;
        var matchCat = true;
        if (activeCategory !== 'all') {
          if (activeCategory.indexOf('cua') !== -1 || activeCategory.indexOf('hải sản') !== -1) {
            matchCat = text.indexOf('cua') !== -1 || text.indexOf('tôm') !== -1 || text.indexOf('ghẹ') !== -1 || text.indexOf('hàu') !== -1 || text.indexOf('bề bề') !== -1 || text.indexOf('bào ngư') !== -1 || text.indexOf('ốc') !== -1 || text.indexOf('mực') !== -1 || text.indexOf('sò') !== -1;
          } else if (activeCategory.indexOf('bò') !== -1 || activeCategory.indexOf('nướng') !== -1 || activeCategory.indexOf('bbq') !== -1) {
            matchCat = text.indexOf('bò') !== -1 || text.indexOf('sườn') !== -1 || text.indexOf('wagyu') !== -1 || text.indexOf('nướng') !== -1 || text.indexOf('cừu') !== -1;
          } else if (activeCategory.indexOf('dimsum') !== -1 || activeCategory.indexOf('sashimi') !== -1 || activeCategory.indexOf('sushi') !== -1 || activeCategory.indexOf('khai vị') !== -1) {
            matchCat = text.indexOf('sashimi') !== -1 || text.indexOf('sushi') !== -1 || text.indexOf('há cảo') !== -1 || text.indexOf('dimsum') !== -1 || text.indexOf('xíu mại') !== -1 || text.indexOf('cá hồi') !== -1 || text.indexOf('bánh bao') !== -1 || text.indexOf('salad') !== -1 || text.indexOf('súp') !== -1;
          } else if (activeCategory.indexOf('lẩu') !== -1 || activeCategory.indexOf('tráng miệng') !== -1 || activeCategory.indexOf('đồ uống') !== -1) {
            matchCat = text.indexOf('lẩu') !== -1 || text.indexOf('tomyum') !== -1 || text.indexOf('chè') !== -1 || text.indexOf('bánh') !== -1 || text.indexOf('kem') !== -1 || text.indexOf('trái cây') !== -1 || text.indexOf('nước') !== -1;
          }
        }
        var matchTaste = true;
        if (activeTaste === 'best' || activeTaste.indexOf('đầu bếp') !== -1 || activeTaste.indexOf('must') !== -1) {
          matchTaste = text.indexOf('cua') !== -1 || text.indexOf('tôm hùm') !== -1 || text.indexOf('wagyu') !== -1 || text.indexOf('sashimi') !== -1 || text.indexOf('bào ngư') !== -1;
        } else if (activeTaste === 'grill' || activeTaste.indexOf('nướng') !== -1) {
          matchTaste = text.indexOf('nướng') !== -1 || text.indexOf('đút lò') !== -1 || text.indexOf('áp chảo') !== -1;
        } else if (activeTaste === 'steam' || activeTaste.indexOf('hấp') !== -1 || activeTaste.indexOf('không cay') !== -1) {
          matchTaste = text.indexOf('ớt') === -1 && text.indexOf('tomyum') === -1 && text.indexOf('cay') === -1;
        } else if (activeTaste === 'spicy' || activeTaste.indexOf('cay') !== -1) {
          matchTaste = text.indexOf('ớt') !== -1 || text.indexOf('tiêu') !== -1 || text.indexOf('tomyum') !== -1 || text.indexOf('muối') !== -1 || text.indexOf('cay') !== -1;
        } else if (activeTaste === 'kids' || activeTaste.indexOf('trẻ em') !== -1) {
          matchTaste = text.indexOf('phô mai') !== -1 || text.indexOf('há cảo') !== -1 || text.indexOf('bánh') !== -1 || text.indexOf('kem') !== -1 || text.indexOf('súp') !== -1;
        }

        var show = matchSearch && matchCat && matchTaste;
        card.style.display = show ? '' : 'none';
        if (show) {
          visibleCount++;
          card.classList.remove('oceania-fade-in');
          void card.offsetWidth;
          card.classList.add('oceania-fade-in');
        }
      });

      var emptySection = document.getElementById('menu-empty-state-section');
      if (emptySection) {
        emptySection.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('q')) {
      activeQuery = urlParams.get('q');
      searchInputs.forEach(function (inp) { inp.value = activeQuery; });
    }
    searchInputs.forEach(function (inp) {
      inp.addEventListener('input', function () {
        activeQuery = inp.value;
        searchInputs.forEach(function (other) { if (other !== inp) other.value = activeQuery; });
        filterMenuCards();
      });
    });
    if (activeQuery) filterMenuCards();

    /* Clear / Reset filters button on menu.html & S13 empty state */
    document.querySelectorAll('[data-node-id="3375:241"], #menu-empty-state-section [data-name*="Nút"]').forEach(function (clearBtn) {
      clearBtn.setAttribute('data-oceania-handled', '1');
      clearBtn.style.cursor = 'pointer';
      clearBtn.addEventListener('click', function () {
        activeQuery = '';
        activeCategory = 'all';
        activeTaste = 'all';
        searchInputs.forEach(function (inp) { inp.value = ''; });
        document.querySelectorAll('[data-node-id="3375:243"] > div, [data-name="Bộ lọc danh mục"] > div, [data-name="Thanh danh mục"] > div').forEach(function (sib, i) {
          sib.style.backgroundColor = i === 0 ? '#07192f' : '#ffffff';
          var sp = sib.querySelector('p');
          if (sp) sp.style.color = i === 0 ? '#f8f9fa' : '#1e293b';
        });
        filterMenuCards();
        showToast('Đã đặt lại toàn bộ bộ lọc thực đơn.');
      });
    });

    /* Sticky Category Tabs on menu.html (Desktop + Tablet + Mobile) */
    document.querySelectorAll('[data-node-id="3375:243"] > div, [data-name="Bộ lọc danh mục"] > div, [data-name="Thanh danh mục"] > div, [data-node-id="3504:3185"] > div, [data-node-id="3375:37711"] > div').forEach(function (tab) {
      tab.style.cursor = 'pointer';
      tab.addEventListener('click', function () {
        var txt = getText(tab).toLowerCase();
        if (txt === 'cay' || txt === 'không cay' || txt === 'must-try') {
          activeTaste = (activeTaste === txt) ? 'all' : txt;
        } else if (txt.indexOf('tất cả') !== -1 || txt.indexOf('toàn bộ') !== -1) {
          activeCategory = 'all';
          activeTaste = 'all';
        } else {
          activeCategory = txt;
        }

        Array.from(tab.parentElement.children).forEach(function (sib) {
          sib.style.backgroundColor = '#ffffff';
          sib.style.borderColor = '#e2e8f0';
          var sp = sib.querySelector('p');
          if (sp) sp.style.color = '#1e293b';
        });
        tab.style.backgroundColor = '#07192f';
        tab.style.borderColor = '#d4af37';
        var tp = tab.querySelector('p');
        if (tp) tp.style.color = '#f8f9fa';

        filterMenuCards();
      });
    });

    /* Native Figma Taste Pills (Desktop 3375:258 + Tablet 3504:3202 + Mobile 3375:37728) */
    document.querySelectorAll('[data-node-id="3375:258"] > div, [data-node-id="3504:3202"] > div, [data-node-id="3375:37728"] > div, [data-name="Bộ lọc khẩu vị"] > div, [data-name="Khẩu vị"] > div').forEach(function (pill) {
      pill.style.cursor = 'pointer';
      pill.addEventListener('click', function () {
        var txt = getText(pill).toLowerCase();
        if (activeTaste === txt) {
          activeTaste = 'all';
          pill.style.backgroundColor = '#ffffff';
          var p0 = pill.querySelector('p');
          if (p0) p0.style.color = '#1e293b';
        } else {
          activeTaste = txt;
          Array.from(pill.parentElement.children).forEach(function (sib) {
            sib.style.backgroundColor = '#ffffff';
            var sp = sib.querySelector('p');
            if (sp) sp.style.color = '#1e293b';
          });
          pill.style.backgroundColor = '#ff5a36';
          var pp = pill.querySelector('p');
          if (pp) pp.style.color = '#ffffff';
        }
        filterMenuCards();
      });
    });

    /* Custom Taste & Dietary Pills (#menu-taste-pills) */
    var tasteWrap = document.getElementById('menu-taste-pills');
    if (tasteWrap) {
      tasteWrap.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-taste]');
        if (!btn) return;
        activeTaste = btn.getAttribute('data-taste') || 'all';
        tasteWrap.querySelectorAll('[data-taste]').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        filterMenuCards();
      });
    }
  }

  /* ==========================================================================
     8. PRICING PAGE (pricing.html): INTERACTIVE COST CALCULATOR
     ========================================================================== */
  function initPricingPage() {
    var calcSection = document.querySelector('[data-node-id="3361:12947"]');
    var daySel = document.getElementById('pricing-day-select');
    var shiftSel = document.getElementById('pricing-shift-select');
    if (!calcSection && !daySel && !shiftSel) return;

    var calcState = {
      adults: 4,
      kids: 1,
      babies: 1
    };

    var adultCountEl = document.querySelector('[data-node-id="3361:12971"]');
    var kidCountEl = document.querySelector('[data-node-id="3361:12979"]');
    var babyCountEl = document.querySelector('[data-node-id="3361:12987"]');

    function getUnitPrice() {
      var shiftTxt = shiftSel ? shiftSel.value : '';
      var dayTxt = daySel ? daySel.value : '';
      if (shiftTxt.indexOf('569') !== -1) return 569000;
      if (shiftTxt.indexOf('369') !== -1 || (shiftTxt.indexOf('Trưa') !== -1 && dayTxt.indexOf('weekday') !== -1)) return 369000;
      return 469000;
    }

    function updatePricingCalculator() {
      var unit = getUnitPrice();
      var kidUnit = Math.round(unit * 0.5);
      var adultSub = calcState.adults * unit;
      var kidSub = calcState.kids * kidUnit;
      var discount = calcState.adults >= 10 ? unit : 0;
      var subTotal = adultSub + kidSub - discount;
      var vat = Math.round(subTotal * 0.08);
      var grandTotal = subTotal + vat;

      if (adultCountEl) adultCountEl.textContent = String(calcState.adults);
      if (kidCountEl) kidCountEl.textContent = String(calcState.kids);
      if (babyCountEl) babyCountEl.textContent = String(calcState.babies);

      var r1Label = document.querySelector('[data-node-id="3361:12995"]');
      var r1Val = document.querySelector('[data-node-id="3361:12996"]');
      if (r1Label) r1Label.textContent = calcState.adults + ' Người lớn × ' + fmtVnd(unit);
      if (r1Val) r1Val.textContent = fmtVnd(adultSub);

      var r2Label = document.querySelector('[data-node-id="3361:12998"]');
      var r2Val = document.querySelector('[data-node-id="3361:12999"]');
      if (r2Label) r2Label.textContent = calcState.kids + ' Trẻ em (1m–1.3m) × ' + fmtVnd(kidUnit);
      if (r2Val) r2Val.textContent = fmtVnd(kidSub);

      var r3Val = document.querySelector('[data-node-id="3361:13002"]');
      if (r3Val) r3Val.textContent = calcState.babies + ' bé · Miễn phí';

      var r4Label = document.querySelector('[data-node-id="3375:208"]');
      var r4Val = document.querySelector('[data-node-id="3375:209"]');
      if (r4Label) r4Label.textContent = discount > 0 ? 'VAT (8%) · Đã trừ ưu đãi Đi 10 Tặng 1' : 'Thuế VAT (8%)';
      if (r4Val) r4Val.textContent = fmtVnd(vat);

      var totalVal = document.querySelector('[data-node-id="3361:13005"]');
      if (totalVal) totalVal.textContent = fmtVnd(grandTotal);
    }

    var counterPairs = [
      { minus: '3361:12970', plus: '3361:12972', key: 'adults', min: 1, max: 50 },
      { minus: '3361:12978', plus: '3361:12980', key: 'kids', min: 0, max: 30 },
      { minus: '3361:12986', plus: '3361:12988', key: 'babies', min: 0, max: 15 }
    ];
    counterPairs.forEach(function (cfg) {
      var mBtn = document.querySelector('[data-node-id="' + cfg.minus + '"]');
      var pBtn = document.querySelector('[data-node-id="' + cfg.plus + '"]');
      if (mBtn) {
        mBtn.style.cursor = 'pointer';
        mBtn.addEventListener('click', function () {
          calcState[cfg.key] = Math.max(cfg.min, calcState[cfg.key] - 1);
          updatePricingCalculator();
        });
      }
      if (pBtn) {
        pBtn.style.cursor = 'pointer';
        pBtn.addEventListener('click', function () {
          calcState[cfg.key] = Math.min(cfg.max, calcState[cfg.key] + 1);
          updatePricingCalculator();
        });
      }
    });

    if (daySel) daySel.addEventListener('change', updatePricingCalculator);
    if (shiftSel) shiftSel.addEventListener('change', updatePricingCalculator);
    updatePricingCalculator();

    /* Tier Card quick-selectors (3361:12885 Trưa / 3361:12900 Tối / 3361:12915 VIP) -> sync Calculator */
    [
      { nid: '3361:12885', tier: '369000', day: 'weekday', label: 'Buffet Trưa 369.000đ' },
      { nid: '3361:12900', tier: '469000', day: 'weekend', label: 'Buffet Tối 469.000đ' },
      { nid: '3361:12915', tier: '569000', day: 'weekend', label: 'Buffet VIP Tôm Hùm 569.000đ' }
    ].forEach(function (cfg) {
      var btn = document.querySelector('[data-node-id="' + cfg.nid + '"]');
      if (btn) {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function () {
          if (daySel) daySel.value = cfg.day;
          if (shiftSel) shiftSel.value = cfg.tier;
          updatePricingCalculator();
          if (calcSection) calcSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          showToast('Đã chọn gói ' + cfg.label + ' vào Công cụ tính chi phí.');
        });
      }
    });

    /* Tier Cards & Calculator CTA buttons -> booking.html with selected tier & guest counts */
    document.querySelectorAll('[data-name*="Action"], [data-name*="Nút"]').forEach(function (cta) {
      var txt = getText(cta).toLowerCase();
      if (txt.indexOf('đặt bàn') !== -1 || txt.indexOf('chọn gói') !== -1) {
        cta.setAttribute('data-oceania-handled', '1');
        cta.style.cursor = 'pointer';
        cta.addEventListener('click', function (e) {
          e.preventDefault();
          var cardTxt = getText(cta.closest('[data-node-id]') || cta).toLowerCase();
          var tier = shiftSel ? shiftSel.value : '469000';
          if (cardTxt.indexOf('369') !== -1 || cardTxt.indexOf('trưa') !== -1) tier = '369000';
          else if (cardTxt.indexOf('569') !== -1 || cardTxt.indexOf('vip') !== -1) tier = '569000';
          else if (cardTxt.indexOf('469') !== -1 || cardTxt.indexOf('tối') !== -1) tier = '469000';
          window.location.href = 'booking.html?tier=' + encodeURIComponent(tier) + '&guests=' + encodeURIComponent(calcState.adults + calcState.kids);
        });
      }
    });
  }

  /* ==========================================================================
     9. PROMOTIONS PAGE (promotions.html): FLASHSALE COUNTDOWN, MODAL S14 & PARTY FORM S15
     ========================================================================== */
  function initPromotionsPage() {
    var hEl = document.getElementById('flash-hours');
    var mEl = document.getElementById('flash-mins');
    var sEl = document.getElementById('flash-secs');

    if (hEl && mEl && sEl) {
      var remainingSecs = 3 * 3600 + 45 * 60 + 18;
      setInterval(function () {
        remainingSecs = remainingSecs > 0 ? remainingSecs - 1 : 3 * 3600 + 59 * 60 + 59;
        var h = Math.floor(remainingSecs / 3600);
        var m = Math.floor((remainingSecs % 3600) / 60);
        var s = remainingSecs % 60;
        hEl.textContent = (h < 10 ? '0' : '') + h;
        mEl.textContent = (m < 10 ? '0' : '') + m;
        sEl.textContent = (s < 10 ? '0' : '') + s;
      }, 1000);
    }

    var flashBtn = document.getElementById('oceania-claim-flash-btn');
    var activePromo = { code: 'OCN-10TANG1', title: 'ĐI 10 TẶNG 1 · NHÓM ĐOÀN', desc: 'Áp dụng cho đoàn từ 10 người lớn trở lên tại toàn hệ thống TP.HCM.' };

    function openPromoModalWith(code, title, desc) {
      activePromo = { code: code, title: title, desc: desc };
      var m = document.getElementById('modal-s14');
      if (m) {
        var codeNode = m.querySelector('[data-node-id="3375:39238"] p, [data-node-id="3375:39239"]');
        if (codeNode) codeNode.textContent = code;
        var tNode = m.querySelector('[data-node-id="3375:39228"]');
        if (tNode) tNode.textContent = title;
      }
      openModal('modal-s14');
    }

    if (flashBtn) {
      flashBtn.addEventListener('click', function () {
        openPromoModalWith('OCN-FLASH20', 'FLASHSALE · GIẢM NGAY 20% VÉ TỐI', 'Số lượng giới hạn trong khung giờ vàng hôm nay tại Q.1, Q.7 và Thủ Đức.');
      });
    }

    /* Filter Promo Cards on promotions.html (Desktop 3361:13145 + Tablet 3504:2763 + Mobile 3375:37292) */
    document.querySelectorAll('[data-node-id="3361:13145"], [data-node-id="3504:2763"], [data-node-id="3375:37292"], .oceania-tablet-view [data-name="Thanh lọc"], .oceania-mobile-view [data-name="Thanh lọc"]').forEach(function (promoFilterWrap) {
      var scope = promoFilterWrap.closest('.oceania-desktop-view, .oceania-tablet-view, .oceania-mobile-view') || document;
      var promoCards = scope.querySelectorAll('[data-name="Ưu đãi"], [data-name="Thẻ ưu đãi"]');
      if (promoCards.length === 0) return;
      Array.from(promoFilterWrap.children).forEach(function (pill) {
        pill.style.cursor = 'pointer';
        pill.addEventListener('click', function () {
          var cat = getText(pill).toLowerCase();
          Array.from(promoFilterWrap.children).forEach(function (sib) {
            sib.style.backgroundColor = '#ffffff';
            var sp = sib.querySelector('p');
            if (sp) sp.style.color = '#1e293b';
          });
          pill.style.backgroundColor = '#07192f';
          var pp = pill.querySelector('p');
          if (pp) pp.style.color = '#f8f9fa';

          var shown = 0;
          promoCards.forEach(function (card) {
            var t = getText(card).toLowerCase();
            var show = cat.indexOf('tất cả') !== -1 ||
              (cat.indexOf('đoàn') !== -1 && (t.indexOf('đoàn') !== -1 || t.indexOf('10 tặng 1') !== -1 || t.indexOf('nhóm') !== -1)) ||
              (cat.indexOf('sinh nhật') !== -1 && t.indexOf('sinh nhật') !== -1) ||
              (cat.indexOf('ngân hàng') !== -1 && (t.indexOf('thẻ') !== -1 || t.indexOf('ngân hàng') !== -1 || t.indexOf('visa') !== -1 || t.indexOf('trưa') !== -1 || t.indexOf('club') !== -1)) ||
              (cat.indexOf('tháng') !== -1 && (t.indexOf('tháng') !== -1 || t.indexOf('mùa') !== -1 || t.indexOf('trưa') !== -1 || t.indexOf('hải sản') !== -1)) ||
              (cat.indexOf('thành viên') !== -1 && (t.indexOf('club') !== -1 || t.indexOf('thẻ') !== -1 || t.indexOf('trưa') !== -1));
            card.style.display = show ? '' : 'none';
            if (show) shown++;
          });
          if (shown === 0) {
            promoCards.forEach(function (card) { card.style.display = ''; });
            shown = promoCards.length;
          }
          showToast('Đang hiển thị ' + shown + ' chương trình ưu đãi · ' + getText(pill));
        });
      });
    });

    /* Open S14 Promo Modal with context-aware code when clicking promo cards */
    document.querySelectorAll('[data-name="Nút nhận ưu đãi"], [data-name="Thẻ ưu đãi"] [data-name="Nút hành động"]').forEach(function (btn) {
      btn.setAttribute('data-oceania-handled', '1');
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var cardTxt = getText(btn.closest('[data-name="Thẻ ưu đãi"]') || btn).toLowerCase();
        if (cardTxt.indexOf('sinh nhật') !== -1) {
          openPromoModalWith('OCN-BIRTHDAY', 'TIỆC SINH NHẬT · TẶNG BÁNH KEM & DECOR', 'Tặng miễn phí bánh kem lạnh Pháp + set trang trí bàn VIP cho đoàn từ 6 khách.');
        } else if (cardTxt.indexOf('club') !== -1 || cardTxt.indexOf('thành viên') !== -1 || cardTxt.indexOf('trưa') !== -1) {
          openPromoModalWith('OCN-CLUB20', 'THỨ 3 OCEANIA CLUB · ƯU ĐÃI HỘI VIÊN', 'Giảm 15% trực tiếp tổng hóa đơn cho thẻ thành viên Bạc, Vàng, Kim Cương.');
        } else {
          openPromoModalWith('OCN-10TANG1', 'ĐI 10 TẶNG 1 · ĐOÀN ĐÔNG TIẾT KIỆM', 'Áp dụng cho nhóm từ 10 người lớn khi đặt bàn trước qua hệ thống Oceania.');
        }
      });
    });

    /* Inside Modal S14: Copy Code & Apply */
    var modalS14 = document.getElementById('modal-s14');
    if (modalS14) {
      modalS14.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-name*="Nút"], [data-name*="Action"]');
        if (!btn) return;
        var txt = getText(btn);
        if (txt.indexOf('Sao chép') !== -1) {
          if (navigator.clipboard) navigator.clipboard.writeText(activePromo.code);
          showToast('Đã sao chép mã ưu đãi ' + activePromo.code + ' vào bộ nhớ tạm!');
        } else if (txt.indexOf('Áp dụng') !== -1 || txt.indexOf('Đặt bàn') !== -1) {
          window.location.href = 'booking.html?promo=' + encodeURIComponent(activePromo.code);
        } else if (txt.indexOf('Đóng') !== -1) {
          closeModal('modal-s14');
        }
      });
    }

    /* Group Party Form Submission (Desktop + Tablet + Mobile) -> S15 */
    document.querySelectorAll('[data-node-id="3361:13249"], .oceania-tablet-view [data-name="Biểu mẫu tiệc"] [data-name="Nút hành động"], .oceania-mobile-view [data-name="Biểu mẫu tiệc"] [data-name="Nút hành động"]').forEach(function (partyBtn) {
      partyBtn.setAttribute('data-oceania-handled', '1');
      partyBtn.style.cursor = 'pointer';
      partyBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var scope = partyBtn.closest('section, [data-node-id]') || document;
        var nameInp = scope.querySelector('[data-oceania-field="promo-name"]') || document.getElementById('promo-party-name');
        var phoneInp = scope.querySelector('[data-oceania-field="promo-phone"]') || document.getElementById('promo-party-phone');
        var nameVal = nameInp ? nameInp.value.trim() : '';
        var phoneVal = phoneInp ? phoneInp.value.trim().replace(/\s+/g, '') : '';
        if (!nameVal || !/^0\d{9}$/.test(phoneVal)) {
          showToast('Vui lòng nhập họ tên và số điện thoại 10 số hợp lệ để nhận báo giá tiệc đoàn.');
          return;
        }
        var s15 = document.getElementById('promo-party-success-section');
        if (s15) {
          s15.style.display = 'block';
          s15.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        showToast('Đã gửi yêu cầu đặt tiệc đoàn! Quản lý sự kiện Oceania sẽ liên hệ trong 15 phút.');
      });
    });
  }

  /* ==========================================================================
     10. BLOG (blog.html) & POST DETAIL (post-detail.html)
     ========================================================================== */
  function initBlogAndPostDetail() {
    var blogSearches = document.querySelectorAll('#blog-search-input, [data-oceania-field="blog-search"]');
    var blogCards = document.querySelectorAll('.oceania-desktop-view [data-name="Bài viết"], .oceania-tablet-view [data-name="Bài viết"], .oceania-mobile-view [data-name="Bài viết"]');

    blogSearches.forEach(function (inp) {
      inp.addEventListener('input', function () {
        var q = inp.value.trim().toLowerCase();
        blogSearches.forEach(function (other) { if (other !== inp) other.value = inp.value; });
        blogCards.forEach(function (card) {
          var t = getText(card).toLowerCase();
          card.style.display = (!q || t.indexOf(q) !== -1) ? '' : 'none';
        });
      });
    });

    document.querySelectorAll('[data-node-id="3361:13380"], .oceania-tablet-view [data-name="Bộ lọc"], .oceania-mobile-view [data-name="Bộ lọc"]').forEach(function (blogFilterWrap) {
      if (blogFilterWrap.parentElement && blogFilterWrap.children.length < 2) return;
      if (getText(blogFilterWrap).toLowerCase().indexOf('tất cả') === -1) return;
      var scope = blogFilterWrap.closest('.oceania-desktop-view, .oceania-tablet-view, .oceania-mobile-view') || document;
      var scopedCards = scope.querySelectorAll('[data-name="Bài viết"]');
      if (scopedCards.length === 0) return;
      Array.from(blogFilterWrap.children).forEach(function (pill) {
        pill.style.cursor = 'pointer';
        pill.addEventListener('click', function () {
          var cat = getText(pill).toLowerCase();
          Array.from(blogFilterWrap.children).forEach(function (s) {
            s.style.backgroundColor = '#ffffff';
            var p = s.querySelector('p');
            if (p) p.style.color = '#1e293b';
          });
          pill.style.backgroundColor = '#07192f';
          var pp = pill.querySelector('p');
          if (pp) pp.style.color = '#f8f9fa';

          scopedCards.forEach(function (card) {
            var t = getText(card).toLowerCase();
            var show = cat.indexOf('tất cả') !== -1 || t.indexOf(cat.slice(0, 6)) !== -1;
            card.style.display = show ? '' : 'none';
          });
        });
      });
    });

    /* Blog Pagination Pills (Tablet 3504:2942 & Mobile 3375:37470) */
    document.querySelectorAll('[data-node-id="3504:2942"], [data-node-id="3375:37470"]').forEach(function (pagWrap) {
      var scope = pagWrap.closest('.oceania-tablet-view, .oceania-mobile-view') || document;
      Array.from(pagWrap.children).forEach(function (pg) {
        pg.setAttribute('data-oceania-handled', '1');
        pg.style.cursor = 'pointer';
        pg.addEventListener('click', function () {
          Array.from(pagWrap.children).forEach(function (s) {
            s.style.backgroundColor = '#ffffff';
            var p = s.querySelector('p');
            if (p) p.style.color = '#1e293b';
          });
          pg.style.backgroundColor = '#07192f';
          var pp = pg.querySelector('p');
          if (pp) pp.style.color = '#f8f9fa';
          var grid = scope.querySelector('[data-name="Bài viết"]');
          if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
          showToast('Đang hiển thị Cẩm nang Ẩm thực — Trang ' + getText(pg).replace('→', '').trim());
        });
      });
    });

    /* Post Detail Share Buttons (Facebook, Zalo, Copy Link — Desktop + Tablet + Mobile) */
    document.querySelectorAll('[data-name="Nút Facebook"], [data-name="Nút Zalo"], [data-name="Nút sao chép"], [data-node-id="3504:3087"], [data-node-id="3504:3089"], [data-node-id="3504:3091"], [data-node-id="3375:37614"], [data-node-id="3375:37616"], [data-node-id="3375:37618"]').forEach(function (shareBtn) {
      shareBtn.setAttribute('data-oceania-handled', '1');
      shareBtn.style.cursor = 'pointer';
      shareBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var t = getText(shareBtn).toLowerCase();
        var shareUrl = window.location.href;
        if (t.indexOf('facebook') !== -1) {
          window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl), '_blank', 'noopener,noreferrer');
          showToast('Đang mở chia sẻ bài viết lên Facebook.');
        } else if (t.indexOf('zalo') !== -1) {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareUrl).catch(function () {});
          }
          showToast('Đã sao chép liên kết bài viết để gửi nhanh qua Zalo!');
        } else {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareUrl).catch(function () {});
          }
          var p = shareBtn.querySelector('p') || shareBtn;
          var orig = p.textContent;
          p.textContent = '✓ Đã sao chép';
          setTimeout(function () { p.textContent = orig; }, 1800);
          showToast('Đã sao chép liên kết bài viết vào bộ nhớ tạm!');
        }
      });
    });

    /* Post Detail Dynamic Title & Share buttons from ?post=... */
    var params = new URLSearchParams(window.location.search);
    var postParam = params.get('post');
    if (postParam) {
      var h1Node = document.querySelector('[data-node-id="3361:13556"] p, [data-name="Tiêu đề bài"] p');
      if (h1Node) h1Node.textContent = postParam;
    }

    /* Post Detail Live Comment Submission (Desktop + Tablet + Mobile) */
    document.querySelectorAll('[data-node-id="3361:13648"], .oceania-tablet-view [data-name="Biểu mẫu bình luận"] [data-name="Nút hành động"], .oceania-mobile-view [data-name="Biểu mẫu bình luận"] [data-name="Nút hành động"]').forEach(function (submitCommentBtn) {
      submitCommentBtn.setAttribute('data-oceania-handled', '1');
      submitCommentBtn.style.cursor = 'pointer';
      submitCommentBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var scope = submitCommentBtn.closest('.oceania-desktop-view, .oceania-tablet-view, .oceania-mobile-view') || document;
        var commentInp = scope.querySelector('[data-oceania-field="post-comment-text"]') || document.getElementById('post-comment-text');
        var commentName = scope.querySelector('[data-oceania-field="post-comment-name"]') || document.getElementById('post-comment-name');
        var commentList = document.getElementById('post-comments-section');
        var author = commentName && commentName.value.trim() ? commentName.value.trim() : 'Thực khách Oceania';
        var content = commentInp ? commentInp.value.trim() : '';
        if (!content) {
          showToast('Vui lòng nhập nội dung bình luận chia sẻ trải nghiệm của bạn.');
          return;
        }
        var newComment = document.createElement('div');
        newComment.style.cssText = 'max-width:960px;margin:16px auto;padding:18px 24px;background:#ffffff;border:1px solid #d4af37;border-radius:8px;';
        newComment.innerHTML =
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
          '<strong style="font-size:14px;color:#07192f;">' + author + ' <span style="font-size:11px;color:#0d9488;font-weight:600;">• Hội viên Oceania</span></strong>' +
          '<span style="font-size:12px;color:#64748b;">Vừa xong</span>' +
          '</div>' +
          '<p style="font-size:14px;color:#1e293b;line-height:1.6;">' + content.replace(/</g, '&lt;') + '</p>';
        if (commentList) {
          commentList.insertBefore(newComment, commentList.firstChild);
        }
        if (commentInp) commentInp.value = '';
        showToast('Cảm ơn bạn! Bình luận của bạn đã được đăng lên Cẩm nang Ẩm thực.');
      });
    });
  }

  /* ==========================================================================
     11. LOCATIONS PAGE (locations.html): GOOGLE MAPS SWITCHER & CONTACT FORM
     ========================================================================== */
  function initLocationsPage() {
    var mapIframe = document.getElementById('oceania-gmap-iframe');
    var extMapBtn = document.getElementById('oceania-ext-maps-btn');

    function activateBranchBtn(btn, silent) {
      if (!btn) return;
      document.querySelectorAll('.oceania-map-branch-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      var q = btn.getAttribute('data-map-query') || 'Vincom+Center+Dong+Khoi+Quan+1+TPHCM';
      if (mapIframe) {
        mapIframe.src = 'https://maps.google.com/maps?q=' + q + '&t=&z=16&ie=UTF8&iwloc=&output=embed';
      }
      if (extMapBtn) {
        extMapBtn.href = 'https://www.google.com/maps/search/?api=1&query=' + q;
      }
      if (!silent) showToast('Đã chuyển bản đồ vệ tinh sang: ' + getText(btn));
    }

    document.querySelectorAll('.oceania-map-branch-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { activateBranchBtn(btn, false); });
    });

    var locParams = new URLSearchParams(window.location.search);
    var branchParam = (locParams.get('branch') || '').toLowerCase();
    if (branchParam) {
      document.querySelectorAll('.oceania-map-branch-btn').forEach(function (btn) {
        if (getText(btn).toLowerCase().indexOf(branchParam.slice(0, 6)) !== -1) {
          activateBranchBtn(btn, true);
        }
      });
    }

    /* Contact Form Validation (S19) & Success (S20) across Desktop/Tablet/Mobile */
    document.querySelectorAll('#contact-pane-default [data-node-id="3361:14267"], .oceania-tablet-view [data-name="Biểu mẫu"] [data-name="Nút hành động"], .oceania-mobile-view [data-name="Biểu mẫu"] [data-name="Nút hành động"]').forEach(function (sendBtn) {
      sendBtn.setAttribute('data-oceania-handled', '1');
      sendBtn.style.cursor = 'pointer';
      sendBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var scope = sendBtn.closest('.oceania-desktop-view, .oceania-tablet-view, .oceania-mobile-view') || document;
        var nameInp = scope.querySelector('[data-oceania-field="contact-name"]') || document.getElementById('contact-name');
        var phoneInp = scope.querySelector('[data-oceania-field="contact-phone"]') || document.getElementById('contact-phone');
        var msgInp = scope.querySelector('[data-oceania-field="contact-message"]') || document.getElementById('contact-message');
        var nameVal = nameInp ? nameInp.value.trim() : '';
        var phoneVal = phoneInp ? phoneInp.value.trim().replace(/\s+/g, '') : '';
        var msgVal = msgInp ? msgInp.value.trim() : '';

        var isPhoneOrEmail = /^0\d{9}$/.test(phoneVal) || phoneVal.indexOf('@') !== -1;
        if (!nameVal || !isPhoneOrEmail || !msgVal) {
          showToast('Vui lòng điền đầy đủ Họ tên, SĐT 10 số (hoặc Email) và Nội dung liên hệ.');
          return;
        }
        document.querySelectorAll('.oceania-contact-pane').forEach(function (p) {
          p.classList.remove('active');
        });
        var s20 = document.getElementById('contact-pane-success');
        if (s20) {
          s20.classList.add('active');
          s20.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        showToast('Đã gửi thông tin liên hệ tới Ban Quản Lý Oceania TP.HCM!');
      });
    });

    var errPane = document.getElementById('contact-pane-error');
    if (errPane) {
      errPane.addEventListener('click', function (e) {
        if (e.target.closest('[data-name*="Nút"]')) {
          document.querySelectorAll('.oceania-contact-pane').forEach(function (p) { p.classList.remove('active'); });
          var def = document.getElementById('contact-pane-default');
          if (def) def.classList.add('active');
        }
      });
    }
  }

  /* ==========================================================================
     12. REVIEWS & VIP PAGE (reviews.html): FILTER, CLUB MODAL, S17 & POST REVIEW
     ========================================================================== */
  function initReviewsPage() {
    var selectedStars = 5;
    var starPicker = document.getElementById('review-star-picker');
    var starLabel = document.getElementById('review-star-label');
    var starLabels = { 1: '1/5 · Cần cải thiện', 2: '2/5 · Chưa hài lòng', 3: '3/5 · Khá ổn', 4: '4/5 · Hài lòng', 5: '5/5 · Tuyệt vời' };

    if (starPicker) {
      starPicker.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-star]');
        if (!btn) return;
        selectedStars = parseInt(btn.getAttribute('data-star'), 10) || 5;
        starPicker.querySelectorAll('[data-star]').forEach(function (sBtn) {
          var v = parseInt(sBtn.getAttribute('data-star'), 10);
          sBtn.classList.toggle('active', v <= selectedStars);
        });
        if (starLabel) starLabel.textContent = starLabels[selectedStars] || '5/5 · Tuyệt vời';
      });
    }

    var photoInp = document.getElementById('review-modal-photo');
    var photoName = document.getElementById('review-modal-file-name');
    if (photoInp && photoName) {
      photoInp.addEventListener('change', function () {
        if (photoInp.files && photoInp.files[0]) {
          photoName.textContent = photoInp.files[0].name + ' · Đã chọn đính kèm ✓';
        }
      });
    }

    /* Oceania Club Check & Signup Modal */
    var clubCheckBtn = document.getElementById('club-check-btn');
    var clubResult = document.getElementById('club-check-result');
    var clubPhone = document.getElementById('club-member-phone');
    if (clubCheckBtn && clubResult) {
      clubCheckBtn.addEventListener('click', function () {
        var p = clubPhone ? clubPhone.value.trim().replace(/\s+/g, '') : '';
        if (!/^0\d{9}$/.test(p)) {
          showToast('Vui lòng nhập số điện thoại 10 số hợp lệ để tra cứu thẻ Oceania Club.');
          return;
        }
        clubResult.style.display = 'block';
        clubResult.innerHTML = '✓ Thẻ Hạng <strong>VÀNG (Gold Member)</strong> · Số ĐT: ' + p + ' · Điểm tích lũy: <strong>1.450 điểm</strong> (Giảm 10% hóa đơn & Ưu tiên bàn view bể hải sản).';
        showToast('Tra cứu thẻ Oceania Club thành công!');
      });
    }

    document.querySelectorAll('[data-name*="Nút"], [data-name*="Action"]').forEach(function (btn) {
      var txt = getText(btn).toLowerCase();
      if (txt.indexOf('đăng ký thẻ') !== -1 || txt.indexOf('gia nhập oceania club') !== -1 || txt.indexOf('kiểm tra hạng thẻ') !== -1) {
        btn.setAttribute('data-oceania-handled', '1');
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          openModal('oceania-club-modal');
        });
      }
    });

    /* Review Category Filter (Desktop 3361:14501 + Tablet 3504:3822 + Mobile 3375:38160) */
    document.querySelectorAll('[data-node-id="3361:14501"], [data-node-id="3504:3822"], [data-node-id="3375:38160"], .oceania-tablet-view [data-name="Thanh lọc"], .oceania-mobile-view [data-name="Thanh lọc"]').forEach(function (revFilterWrap) {
      var scope = revFilterWrap.closest('.oceania-desktop-view, .oceania-tablet-view, .oceania-mobile-view') || document;
      var revCards = scope.querySelectorAll('[data-name="Đánh giá khách"], [data-name="Thẻ đánh giá"], [data-node-id="3504:3908"] > div, [data-node-id="3375:38152"] > [data-name="Thẻ nội dung"]:not([data-node-id="3375:38155"])');
      if (revCards.length === 0) return;
      Array.from(revFilterWrap.children).forEach(function (pill) {
        pill.setAttribute('data-oceania-handled', '1');
        pill.style.cursor = 'pointer';
        pill.addEventListener('click', function () {
          var cat = getText(pill).toLowerCase();
          Array.from(revFilterWrap.children).forEach(function (sib) {
            sib.style.backgroundColor = '#ffffff';
            var sp = sib.querySelector('p');
            if (sp) sp.style.color = '#1e293b';
          });
          pill.style.backgroundColor = '#07192f';
          var pp = pill.querySelector('p');
          if (pp) pp.style.color = '#f8f9fa';

          var shown = 0;
          revCards.forEach(function (card) {
            var t = getText(card).toLowerCase();
            var hasImg = !!card.querySelector('img');
            var show = cat.indexOf('tất cả') !== -1 ||
              cat.indexOf('5 sao') !== -1 ||
              (cat.indexOf('hải sản') !== -1 && (t.indexOf('hải sản') !== -1 || t.indexOf('cua') !== -1 || t.indexOf('tôm') !== -1 || t.indexOf('hàu') !== -1 || t.indexOf('sashimi') !== -1)) ||
              (cat.indexOf('bbq') !== -1 && (t.indexOf('bbq') !== -1 || t.indexOf('nướng') !== -1 || t.indexOf('wagyu') !== -1 || t.indexOf('bò') !== -1 || t.indexOf('than') !== -1)) ||
              (cat.indexOf('phục vụ') !== -1 && (t.indexOf('phục vụ') !== -1 || t.indexOf('nhân viên') !== -1 || t.indexOf('tận tâm') !== -1 || t.indexOf('nhanh') !== -1 || t.indexOf('không gian') !== -1)) ||
              (cat.indexOf('ảnh') !== -1 && (hasImg || t.indexOf('ảnh') !== -1 || t.indexOf('bàn') !== -1));
            card.style.display = show ? '' : 'none';
            if (show) shown++;
          });
          if (shown === 0) {
            revCards.forEach(function (card) { card.style.display = ''; });
            shown = revCards.length;
          }
          showToast('Đã lọc ' + shown + ' đánh giá thực khách · ' + getText(pill));
        });
      });
    });

    /* Verify Booking Code (Desktop + Tablet + Mobile) -> S17 Modal or S16 Error */
    document.querySelectorAll('#review-pane-default [data-node-id="3361:14594"], .oceania-tablet-view [data-name="Xác thực đánh giá"] [data-name="Nút hành động"], .oceania-mobile-view [data-name="Xác thực đánh giá"] [data-name="Nút hành động"]').forEach(function (verifyBtn) {
      verifyBtn.setAttribute('data-oceania-handled', '1');
      verifyBtn.style.cursor = 'pointer';
      verifyBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var scope = verifyBtn.closest('.oceania-desktop-view, .oceania-tablet-view, .oceania-mobile-view') || document;
        var codeInp = scope.querySelector('[data-oceania-field="review-code"]') || document.getElementById('review-booking-code');
        var val = codeInp ? codeInp.value.trim().toUpperCase() : '';
        if (!val || (val.indexOf('OCN-') === -1 && !/^0\d{9}$/.test(val))) {
          document.querySelectorAll('.oceania-review-pane').forEach(function (p) { p.classList.remove('active'); });
          var failedPane = document.getElementById('review-pane-failed');
          if (failedPane) failedPane.classList.add('active');
          showToast('Mã đặt bàn không hợp lệ. Gợi ý mã hợp lệ: OCN-311026-001');
          return;
        }
        openModal('modal-s17');
        showToast('Xác thực mã đặt bàn ' + val + ' thành công! Mời bạn chia sẻ đánh giá.');
      });
    });

    /* Retry inside S16 Failed Pane */
    var failedPaneEl = document.getElementById('review-pane-failed');
    if (failedPaneEl) {
      failedPaneEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-name*="Nút"]');
        if (btn) {
          document.querySelectorAll('.oceania-review-pane').forEach(function (p) { p.classList.remove('active'); });
          var defPane = document.getElementById('review-pane-default');
          if (defPane) defPane.classList.add('active');
          var codeInp = document.getElementById('review-booking-code');
          if (codeInp) {
            codeInp.value = 'OCN-311026-001';
            codeInp.focus();
          }
        }
      });
    }

    /* Submit Review inside Default Pane or Modal S17 -> Live append + S18 */
    document.querySelectorAll('[data-node-id="3361:14608"], #modal-s17 [data-node-id="3375:39304"]').forEach(function (btn) {
      btn.setAttribute('data-oceania-handled', '1');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var textInp = document.getElementById('review-modal-text');
        var revBody = textInp && textInp.value.trim() ? textInp.value.trim() : 'Hải sản tươi sống, phục vụ rất tận tâm và chuyên nghiệp!';
        var starsStr = '';
        for (var k = 0; k < selectedStars; k++) starsStr += '★';
        var feedContainer = document.querySelector('[data-node-id="3361:14510"]') || document.querySelector('[data-name="Danh sách đánh giá"]');
        if (feedContainer) {
          var newCard = document.createElement('div');
          newCard.className = 'bg-white border border-[#d4af37] p-[24px] rounded-[4px] mb-[16px] w-full';
          newCard.setAttribute('data-name', 'Thẻ đánh giá');
          newCard.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
            '<strong style="font-size:15px;color:#07192f;">Nguyễn Minh Anh · <span style="color:#059669;font-size:12px;">✓ Đã xác thực OCN</span></strong>' +
            '<span style="color:#d4af37;font-size:16px;">' + starsStr + '</span>' +
            '</div>' +
            '<p style="font-size:14px;color:#1e293b;line-height:1.6;">' + revBody.replace(/</g, '&lt;') + '</p>';
          feedContainer.insertBefore(newCard, feedContainer.firstChild);
        }
        closeModal('modal-s17');
        document.querySelectorAll('.oceania-review-pane').forEach(function (p) {
          p.classList.remove('active');
        });
        var s18 = document.getElementById('review-pane-submitted');
        if (s18) s18.classList.add('active');
        showToast('Cảm ơn đánh giá ' + selectedStars + ' sao của bạn! +100 điểm thưởng Oceania Club đã được cộng.');
      });
    });
  }

  /* ==========================================================================
     13. CAREERS PAGE (careers.html): COMBINED JOB FILTERS & ONLINE CV FORM (S26)
     ========================================================================== */
  function initCareersPage() {
    var deptWrap = document.querySelector('[data-node-id="3483:86"]');
    var branchWrap = document.querySelector('[data-node-id="3483:95"]');
    var jobListWrap = document.querySelector('[data-node-id="3483:118"]');
    var allJobs = document.querySelectorAll('[data-node-id="3483:118"] > div, .oceania-tablet-view [data-name="Vị trí"], .oceania-mobile-view [data-name="Vị trí"], .oceania-tablet-view [data-name="Tin tuyển dụng"], .oceania-mobile-view [data-name="Tin tuyển dụng"]');
    if (!deptWrap && allJobs.length === 0 && !document.querySelector('[data-oceania-field="cv-name"]')) return;

    var jobCards = jobListWrap ? Array.from(jobListWrap.children) : Array.from(allJobs);
    var activeDept = 'tất cả';
    var activeBranch = 'tất cả';

    function matchDeptText(dept, text) {
      return dept.indexOf('tất cả') !== -1 ||
        (dept.indexOf('bếp') !== -1 && (text.indexOf('bếp') !== -1 || text.indexOf('bbq') !== -1 || text.indexOf('line') !== -1 || text.indexOf('nướng') !== -1)) ||
        ((dept.indexOf('sảnh') !== -1 || dept.indexOf('phục vụ') !== -1) && (text.indexOf('sảnh') !== -1 || text.indexOf('phục vụ') !== -1 || text.indexOf('lễ tân') !== -1 || text.indexOf('thu ngân') !== -1)) ||
        ((dept.indexOf('quản lý') !== -1 || dept.indexOf('quản trị') !== -1) && (text.indexOf('giám sát') !== -1 || text.indexOf('quản lý') !== -1 || text.indexOf('trưởng') !== -1 || text.indexOf('quản trị') !== -1));
    }

    function applyCareersFilter() {
      jobCards.forEach(function (card) {
        var t = getText(card).toLowerCase();
        var matchDept = matchDeptText(activeDept, t);
        var matchBranch = activeBranch.indexOf('tất cả') !== -1 || t.indexOf('toàn hệ thống') !== -1 ||
          (activeBranch.indexOf('vincom') !== -1 && (t.indexOf('vincom') !== -1 || t.indexOf('quận 1') !== -1)) ||
          (activeBranch.indexOf('lotte') !== -1 && (t.indexOf('lotte') !== -1 || t.indexOf('quận 7') !== -1)) ||
          (activeBranch.indexOf('cantavil') !== -1 && (t.indexOf('cantavil') !== -1 || t.indexOf('thủ đức') !== -1)) ||
          (activeBranch.indexOf('quận 1') !== -1 && (t.indexOf('quận 1') !== -1 || t.indexOf('vincom') !== -1)) ||
          (activeBranch.indexOf('quận 7') !== -1 && (t.indexOf('quận 7') !== -1 || t.indexOf('lotte') !== -1)) ||
          (activeBranch.indexOf('thủ đức') !== -1 && (t.indexOf('thủ đức') !== -1 || t.indexOf('cantavil') !== -1));
        card.style.display = (matchDept && matchBranch) ? '' : 'none';
      });
    }

    if (deptWrap) {
      Array.from(deptWrap.children).forEach(function (pill) {
        pill.style.cursor = 'pointer';
        pill.addEventListener('click', function () {
          activeDept = getText(pill).toLowerCase();
          Array.from(deptWrap.children).forEach(function (sib) {
            sib.style.backgroundColor = '#ffffff';
            var sp = sib.querySelector('p');
            if (sp) sp.style.color = '#1e293b';
          });
          pill.style.backgroundColor = '#07192f';
          var pp = pill.querySelector('p');
          if (pp) pp.style.color = '#f8f9fa';
          applyCareersFilter();
          showToast('Đã lọc vị trí tuyển dụng · ' + getText(pill));
        });
      });
    }

    /* Tablet (3504:3382) & Mobile (3483:419) Career Department Filter Pills */
    document.querySelectorAll('[data-node-id="3504:3382"], [data-node-id="3483:419"]').forEach(function (tmDeptWrap) {
      var scope = tmDeptWrap.closest('.oceania-tablet-view, .oceania-mobile-view') || document;
      var scopedJobs = scope.querySelectorAll('[data-name="Vị trí"], [data-name="Tin tuyển dụng"], [data-name="Việc làm"]');
      Array.from(tmDeptWrap.children).forEach(function (pill) {
        pill.setAttribute('data-oceania-handled', '1');
        pill.style.cursor = 'pointer';
        pill.addEventListener('click', function () {
          var d = getText(pill).toLowerCase();
          Array.from(tmDeptWrap.children).forEach(function (sib) {
            sib.style.backgroundColor = '#ffffff';
            var sp = sib.querySelector('p');
            if (sp) sp.style.color = '#1e293b';
          });
          pill.style.backgroundColor = '#07192f';
          var pp = pill.querySelector('p');
          if (pp) pp.style.color = '#f8f9fa';
          var shown = 0;
          scopedJobs.forEach(function (card) {
            var ok = matchDeptText(d, getText(card).toLowerCase());
            card.style.display = ok ? '' : 'none';
            if (ok) shown++;
          });
          if (shown === 0) scopedJobs.forEach(function (card) { card.style.display = ''; });
          showToast('Đã lọc tuyển dụng · ' + getText(pill));
        });
      });
    });

    /* Expand / Collapse JD Details when clicking "Mở JD" (3483:137, 157, 177, 216) */
    document.querySelectorAll('[data-name="Nút mở JD"]').forEach(function (jdBtn) {
      jdBtn.setAttribute('data-oceania-handled', '1');
      jdBtn.style.cursor = 'pointer';
      jdBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var card = jdBtn.closest('[data-name="Việc làm"], [data-name="Việc làm mở JD"], [data-node-id]') || jdBtn.parentElement;
        var panel = card ? card.querySelector('.oceania-jd-detail-panel') : null;
        if (panel) {
          var isHidden = panel.style.display === 'none';
          panel.style.display = isHidden ? 'block' : 'none';
          var pLbl = jdBtn.querySelector('p') || jdBtn;
          pLbl.textContent = isHidden ? 'Thu gọn JD' : 'Mở JD';
          return;
        }
        var titleEl = card ? card.querySelector('p') : null;
        var roleName = titleEl ? getText(titleEl) : 'Nhân sự Oceania Buffet';
        var detail = document.createElement('div');
        detail.className = 'oceania-jd-detail-panel';
        detail.style.cssText = 'width:100%;margin-top:12px;padding:16px 18px;background:#f8f9fa;border-left:3px solid #d4af37;border-radius:2px;font-size:13px;color:#1e293b;line-height:1.6;';
        detail.innerHTML =
          '<p style="font-weight:700;color:#07192f;margin-bottom:6px;">Mô tả công việc &amp; Phúc lợi — ' + roleName + '</p>' +
          '<p>• Môi trường nhà hàng buffet hải sản 5 sao tại TP.HCM (Vincom Q1, Lotte Q7, Cantavil Thủ Đức).</p>' +
          '<p>• Thu nhập cạnh tranh + Service Charge + thưởng doanh số tháng + phụ cấp bữa ăn &amp; gửi xe.</p>' +
          '<p>• Lộ trình đào tạo bài bản từ bếp trưởng và quản lý sảnh Oceania, đóng đầy đủ BHXH.</p>';
        if (card) card.appendChild(detail);
        var pLbl2 = jdBtn.querySelector('p') || jdBtn;
        pLbl2.textContent = 'Thu gọn JD';
        showToast('Đang xem chi tiết mô tả công việc (JD).');
      });
    });

    /* Hero & Banner "Ứng tuyển ngay" Buttons (Desktop 3483:51/52 + Tablet 3504:3344 + Mobile) */
    document.querySelectorAll('[data-node-id="3483:51"], [data-node-id="3483:52"], [data-node-id="3504:3344"], .oceania-mobile-view [data-name="Nút hành động"]').forEach(function (ctaBtn) {
      if (getText(ctaBtn).toLowerCase().indexOf('ứng tuyển') === -1) return;
      ctaBtn.setAttribute('data-oceania-handled', '1');
      ctaBtn.style.cursor = 'pointer';
      ctaBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var scope = ctaBtn.closest('.oceania-desktop-view, .oceania-tablet-view, .oceania-mobile-view') || document;
        var target = scope.querySelector('[data-oceania-field="cv-name"]') || document.getElementById('cv-name') || document.querySelector('[data-node-id="3483:222"]');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (target.focus) setTimeout(function () { target.focus(); }, 300);
        }
        showToast('Mời bạn điền thông tin hồ sơ ứng tuyển bên dưới.');
      });
    });

    if (branchWrap) {
      Array.from(branchWrap.children).forEach(function (pill) {
        pill.style.cursor = 'pointer';
        pill.addEventListener('click', function () {
          activeBranch = getText(pill).toLowerCase();
          Array.from(branchWrap.children).forEach(function (sib) {
            sib.style.backgroundColor = '#ffffff';
            var sp = sib.querySelector('p');
            if (sp) sp.style.color = '#1e293b';
          });
          pill.style.backgroundColor = '#ff5a36';
          var pp = pill.querySelector('p');
          if (pp) pp.style.color = '#ffffff';
          applyCareersFilter();
        });
      });
    }

    /* Click "Ứng tuyển ngay" on job cards -> pre-fill role select & scroll to CV form */
    document.querySelectorAll('[data-name="Nút ứng tuyển"]').forEach(function (btn) {
      btn.setAttribute('data-oceania-handled', '1');
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var scope = btn.closest('.oceania-desktop-view, .oceania-tablet-view, .oceania-mobile-view') || document;
        var card = btn.closest('[data-node-id]');
        var roleSel = scope.querySelector('[data-oceania-field="cv-role"]') || document.getElementById('cv-role');
        if (card && roleSel) {
          var cardTxt = getText(card);
          Array.from(roleSel.options).forEach(function (opt) {
            if (cardTxt.indexOf(opt.value.split('—')[0].trim()) !== -1) {
              roleSel.value = opt.value;
            }
          });
        }
        var formSec = scope.querySelector('[data-node-id="3483:222"], [data-name="Form ứng tuyển"]') || document.querySelector('[data-node-id="3483:222"]');
        if (formSec) formSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast('Đã chọn vị trí ứng tuyển. Vui lòng điền thông tin hồ sơ bên dưới.');
      });
    });

    /* Top "Gửi hồ sơ" jump CTA -> smoothly scroll to CV Form */
    var jumpCvBtn = document.querySelector('[data-node-id="3483:229"]');
    if (jumpCvBtn) {
      jumpCvBtn.setAttribute('data-oceania-handled', '1');
      jumpCvBtn.style.cursor = 'pointer';
      jumpCvBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var cvInp = document.getElementById('cv-name');
        if (cvInp) {
          cvInp.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(function () { cvInp.focus(); }, 350);
        }
      });
    }

    /* Online CV Form Submit (Desktop 3483:271 + Tablet/Mobile) -> S26 */
    document.querySelectorAll('[data-node-id="3483:271"], .oceania-tablet-view [data-name="Form ứng tuyển"] [data-name="Nút hành động"], .oceania-mobile-view [data-name="Form ứng tuyển"] [data-name="Nút hành động"]').forEach(function (submitCvBtn) {
      submitCvBtn.setAttribute('data-oceania-handled', '1');
      submitCvBtn.style.cursor = 'pointer';
      submitCvBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var scope = submitCvBtn.closest('.oceania-desktop-view, .oceania-tablet-view, .oceania-mobile-view') || document;
        var nameInp = scope.querySelector('[data-oceania-field="cv-name"]') || document.getElementById('cv-name');
        var phoneInp = scope.querySelector('[data-oceania-field="cv-phone"]') || document.getElementById('cv-phone');
        var nameVal = nameInp ? nameInp.value.trim() : '';
        var phoneVal = phoneInp ? phoneInp.value.trim().replace(/\s+/g, '') : '';
        if (!nameVal || !/^0\d{9}$/.test(phoneVal)) {
          showToast('Vui lòng nhập đầy đủ Họ tên và Số điện thoại 10 số hợp lệ.');
          return;
        }
        var s26 = document.getElementById('careers-success-section');
        if (s26) {
          s26.style.display = 'block';
          s26.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        showToast('Nộp hồ sơ ứng tuyển thành công! Mã hồ sơ: HR-OCN-2610-08');
      });
    });
  }

  /* ==========================================================================
     14. FAQ ACCORDION CONTROLLER (SHARED ACROSS PRICING, LOCATIONS, ETC.)
     ========================================================================== */
  function initFaqAccordions() {
    document.querySelectorAll('[data-name="Câu hỏi"]').forEach(function (faqCard) {
      faqCard.style.cursor = 'pointer';
      faqCard.addEventListener('click', function () {
        var ps = faqCard.querySelectorAll('p');
        if (ps.length >= 2) {
          var ans = ps[ps.length - 1];
          var isHidden = ans.style.display === 'none';
          ans.style.display = isHidden ? '' : 'none';
          ps.forEach(function (p) {
            var txt = getText(p);
            if (txt === '+' || txt === '−' || txt === '-') {
              p.textContent = isHidden ? '−' : '+';
            }
          });
        }
      });
    });
  }

  /* ==========================================================================
     INITIALIZE ALL MODULES ON DOM READY
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    getBookings();
    initStickyHeaderAndScroll();
    initGlobalSearchAutocomplete();
    initGlobalClickRouter();
    initHomepage();
    initLightboxGallery();
    initMenuPage();
    initPricingPage();
    initPromotionsPage();
    initBlogAndPostDetail();
    initLocationsPage();
    initReviewsPage();
    initCareersPage();
    initFaqAccordions();
  });
})();
