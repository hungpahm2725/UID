/**
 * OCEANIA SEAFOOD & BBQ BUFFET — GLOBAL APPLICATION ENGINE (main.js)
 * ------------------------------------------------------------------
 * Responsibilities:
 *  1. Shared state & utilities (window.OceaniaApp: Toast, Modals, localStorage bookings, SVG QR generator)
 *  2. Sticky Glassmorphism Header on scroll + Floating Back-to-Top button
 *  3. Header Live Search Autocomplete (12+ signature dishes with thumbnail & "Đang phục vụ" status)
 *  4. Global Navigation Router, Dish/Blog/Branch card click handlers, Mobile Drawer (S22)
 *  5. Homepage (index.html): 3-Topic Hero Carousel, Fast Booking Quick-Bar, Category Tab Filter with Fade-In
 *  6. Menu (menu.html) & Dish Detail (dish-detail.html): Culinary & Nutrition Database, realtime search & filter
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

  /* Deterministic SVG QR Code Generator */
  function buildSvgQrCode(codeStr) {
    var seed = 0;
    var s = String(codeStr || 'OCN-311026-001');
    for (var i = 0; i < s.length; i++) {
      seed = (seed * 31 + s.charCodeAt(i)) % 1000003;
    }
    var size = 13;
    var rects = [];
    function isFinder(r, c) {
      if (r < 4 && c < 4) return true;
      if (r < 4 && c >= size - 4) return true;
      if (r >= size - 4 && c < 4) return true;
      return false;
    }
    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        if (isFinder(r, c)) continue;
        seed = (seed * 16807 + 11) % 2147483647;
        if (seed % 10 < 5) {
          rects.push('<rect x="' + (12 + c * 6) + '" y="' + (12 + r * 6) + '" width="5" height="5" fill="#07192f" rx="0.8"/>');
        }
      }
    }
    return (
      '<svg viewBox="0 0 102 102" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="102" height="102" fill="#ffffff" rx="4"/>' +
      '<rect x="10" y="10" width="24" height="24" fill="none" stroke="#07192f" stroke-width="3.5"/>' +
      '<rect x="16" y="16" width="12" height="12" fill="#ff5a36"/>' +
      '<rect x="68" y="10" width="24" height="24" fill="none" stroke="#07192f" stroke-width="3.5"/>' +
      '<rect x="74" y="16" width="12" height="12" fill="#07192f"/>' +
      '<rect x="10" y="68" width="24" height="24" fill="none" stroke="#07192f" stroke-width="3.5"/>' +
      '<rect x="16" y="74" width="12" height="12" fill="#07192f"/>' +
      rects.join('') +
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
      'dish-detail.html': 'thực đơn',
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
     4. HEADER LIVE SEARCH AUTOCOMPLETE (12+ DISHES WITH THUMBNAIL & STATUS)
     ========================================================================== */
  function initGlobalSearchAutocomplete() {
    var searchDrawer = document.getElementById('oceania-search-drawer');
    var searchInputs = document.querySelectorAll('.oceania-header-search-input');

    var liveResultsBox = null;
    if (searchDrawer) {
      liveResultsBox = document.createElement('div');
      liveResultsBox.id = 'oceania-live-autocomplete-list';
      liveResultsBox.style.cssText = 'max-width:1280px;margin:0 auto;padding:18px 40px 24px;background:#ffffff;border-top:1px solid #e2e8f0;';
      searchDrawer.appendChild(liveResultsBox);
    }

    function renderAutocompleteItems(query) {
      if (!liveResultsBox) return;
      var q = (query || '').trim().toLowerCase();
      var matches = DISH_DATABASE.filter(function (d) {
        if (!q) return true;
        return d.title.toLowerCase().indexOf(q) !== -1 || d.category.toLowerCase().indexOf(q) !== -1 || d.station.toLowerCase().indexOf(q) !== -1;
      }).slice(0, 8);

      var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
        '<p style="font-size:12px;font-weight:700;color:#ff5a36;letter-spacing:1.2px;text-transform:uppercase;">' +
        (q ? ('KẾT QUẢ TÌM KIẾM TỨC THÌ CHO "' + query + '" (' + matches.length + ' MÓN)') : 'DANH SÁCH MÓN ĐANG PHỤC VỤ TẠI QUẦY LINE (12 MÓN TIÊU BIỂU)') +
        '</p>' +
        '<a href="menu.html' + (q ? ('?q=' + encodeURIComponent(query)) : '') + '" style="font-size:12px;font-weight:600;color:#07192f;text-decoration:underline;">Xem toàn bộ 50+ món →</a>' +
        '</div>';

      if (matches.length === 0) {
        html += '<p style="font-size:13px;color:#64748b;padding:12px 0;">Không tìm thấy món ăn khớp từ khóa. Gợi ý: Tôm hùm bông, Cua Cà Mau, Bò Wagyu, Sashimi, Lẩu Tomyum...</p>';
      } else {
        html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;">';
        matches.forEach(function (dish) {
          html += '<a href="dish-detail.html?dish=' + encodeURIComponent(dish.title) + '" ' +
            'style="display:flex;align-items:center;gap:12px;padding:8px 10px;background:#f8f9fa;border:1px solid #e2e8f0;border-radius:6px;text-decoration:none;color:#1e293b;">' +
            '<img src="' + dish.image + '" alt="' + dish.title + '" style="width:52px;height:42px;object-fit:cover;border-radius:4px;flex-shrink:0;"/>' +
            '<div style="min-width:0;flex:1;">' +
            '<p style="font-size:13px;font-weight:600;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + dish.title + '</p>' +
            '<p style="font-size:11px;color:#0d9488;font-weight:600;">● ' + dish.status + '</p>' +
            '</div>' +
            '</a>';
        });
        html += '</div>';
      }
      liveResultsBox.innerHTML = html;
    }

    searchInputs.forEach(function (inp) {
      inp.addEventListener('focus', function () {
        if (searchDrawer) {
          searchDrawer.classList.add('open');
          renderAutocompleteItems(inp.value);
        }
      });
      inp.addEventListener('input', function () {
        if (searchDrawer) {
          searchDrawer.classList.add('open');
          renderAutocompleteItems(inp.value);
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

    if (searchDrawer) {
      searchDrawer.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-name*="Từ khóa"], [data-name*="Gợi ý"], [data-name*="Món"], [data-name*="Action"], [data-name*="Nút"]');
        if (!btn) return;
        var txt = getText(btn);
        if (txt.indexOf('Đóng') !== -1 || txt === '✕') {
          searchDrawer.classList.remove('open');
          return;
        }
        if (txt.indexOf('Xem toàn bộ') !== -1 || txt.indexOf('Xem tất cả') !== -1) {
          window.location.href = 'menu.html';
          return;
        }
        var dishTitle = txt.split('•')[0].trim();
        if (dishTitle) {
          window.location.href = 'dish-detail.html?dish=' + encodeURIComponent(dishTitle);
        }
      });
    }
  }

  /* ==========================================================================
     5. GLOBAL CLICK ROUTER (NAVIGATION, CARDS, MODALS, NEWSLETTER)
     ========================================================================== */
  function initGlobalClickRouter() {
    document.addEventListener('click', function (e) {
      /* Close modal when clicking backdrop */
      if (e.target.classList && e.target.classList.contains('oceania-modal-overlay')) {
        e.target.classList.remove('open');
        return;
      }

      /* Close search drawer when clicking outside header/drawer */
      var searchDrawer = document.getElementById('oceania-search-drawer');
      if (searchDrawer && searchDrawer.classList.contains('open')) {
        if (!e.target.closest('#oceania-search-drawer') && !e.target.closest('[data-name*="Search"]') && !e.target.closest('[data-name*="tìm kiếm"]') && !e.target.closest('.oceania-header-search-input')) {
          searchDrawer.classList.remove('open');
        }
      }

      /* Mobile / Tablet menu drawer open/close */
      var mobDrawer = document.getElementById('oceania-mobile-drawer');
      var mobTrigger = e.target.closest('[data-name="Nút menu"], [data-name="Menu"], [data-node-id="3375:36593"], [data-node-id="3504:2057"]');
      if (mobTrigger && mobDrawer) {
        mobDrawer.classList.toggle('open');
        return;
      }
      if (mobDrawer && mobDrawer.classList.contains('open')) {
        var closeBtn = e.target.closest('[data-name="Nút đóng"], [data-node-id="3375:39481"]');
        if (closeBtn) {
          mobDrawer.classList.remove('open');
          return;
        }
      }

      /* Global Header / Footer / Drawer Navigation Items */
      var navItem = e.target.closest(
        '[data-name="Navigation item"], [data-name="Tuyển dụng"], [data-name="Mục menu"], ' +
        '[data-name="Oceania wordmark"], [data-name="Logo"], ' +
        '[data-name="Booking action"], [data-name="Nút đặt bàn"], ' +
        '[data-name="Consultation action"], [data-name="Nút tư vấn"], ' +
        '[data-name="Guest services"] p, [data-name="Dịch vụ khách"] p, ' +
        '[data-name="Footer"] p, [data-name="Chân trang"] p'
      );
      if (navItem && !navItem.hasAttribute('data-oceania-handled') && !e.target.closest('input, select, textarea')) {
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
        if (navTxt === 'thực đơn' || navTxt.indexOf('thực đơn 50+ món') !== -1 || navTxt.indexOf('xem toàn bộ thực đơn') !== -1) {
          window.location.href = 'menu.html';
          return;
        }
        if (navTxt === 'bảng giá' || navTxt.indexOf('bảng giá buffet') !== -1) {
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
        if (navTxt.indexOf('tra cứu đặt bàn') !== -1 || navTxt.indexOf('tra cứu vé') !== -1) {
          window.location.href = 'booking-lookup.html';
          return;
        }
        if (navTxt.indexOf('oceania club') !== -1 || navTxt.indexOf('đánh giá & thẻ thành viên') !== -1) {
          window.location.href = 'reviews.html';
          return;
        }
        if (nameAttr.indexOf('booking action') !== -1 || nameAttr.indexOf('nút đặt bàn') !== -1 || navTxt === 'đặt bàn' || navTxt === 'đặt bàn ngay') {
          window.location.href = 'booking.html';
          return;
        }
        if (nameAttr.indexOf('consultation action') !== -1 || nameAttr.indexOf('nút tư vấn') !== -1 || navTxt === 'tư vấn') {
          window.location.href = 'locations.html#oceania-contact-wrapper';
          return;
        }
      }

      /* Newsletter submit in Footer */
      var newsBtn = e.target.closest('[data-name="Newsletter form"] [data-name="Subscribe"], [data-name="Form nhận tin"] [data-name="Nút đăng ký"], [data-node-id="3346:336"]');
      if (newsBtn) {
        e.preventDefault();
        var wrap = newsBtn.closest('[data-name="Newsletter form"], [data-name="Form nhận tin"]') || newsBtn.parentElement;
        var emailInp = wrap ? wrap.querySelector('input') : null;
        var val = emailInp ? emailInp.value.trim() : '';
        if (!val || val.indexOf('@') === -1) {
          showToast('Vui lòng nhập địa chỉ email hợp lệ để nhận ưu đãi Oceania Club.');
        } else {
          showToast('Đăng ký thành công! Voucher giảm 10% đã được gửi tới ' + val);
          if (emailInp) emailInp.value = '';
        }
        return;
      }

      /* Dish Card click -> dish-detail.html?dish=... */
      var dishCard = e.target.closest('[data-name="Featured dish"], [data-name="Dish card"], [data-name="Món ăn"], [data-name="Món phù hợp"]');
      if (dishCard && !e.target.closest('input, select, textarea')) {
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
          window.location.href = 'dish-detail.html?dish=' + encodeURIComponent(dishName);
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
        }
      }
    });
  }

  /* ==========================================================================
     6. HOMEPAGE (index.html): HERO SLIDER, FAST BOOKING BAR, TAB FILTER
     ========================================================================== */
  function initHomepage() {
    var heroFrame = document.querySelector('.oceania-desktop-view [data-node-id="3346:33"]');
    if (!heroFrame) return;

    /* 6.1 Hero Slider (3 topics matching Figma Slide topics) */
    var heroSlides = [
      {
        titleLine1: 'Tinh hoa biển cả —',
        titleLine2: 'Bùng vị lửa hồng',
        desc: 'Hải sản tươi ngon, BBQ nướng than hồng và những cuộc sum vầy trọn vị. Hẹn nhau tại Oceania Seafood & BBQ Buffet, chỉ tại TP.HCM.',
        img: 'assets/figma/349d8.png'
      },
      {
        titleLine1: 'Thăn ngoại Wagyu —',
        titleLine2: 'Nướng than Binchotan',
        desc: 'Thịt bò vân mỡ cẩm thạch MBS 6-7 áp chảo trên đá muối hồng Himalaya và nướng than Binchotan Nhật Bản không khói, giữ trọn vị ngọt mọng nước.',
        img: 'assets/figma/f0ea2.png'
      },
      {
        titleLine1: 'Sảnh kính đại dương —',
        titleLine2: 'Phòng tiệc VIP riêng tư',
        desc: 'Hệ thống 3 cơ sở trung tâm TP.HCM (Vincom Q1, Lotte Mart Q7, Cantavil Thủ Đức) với bể hải sản tràn bờ 18m và phòng tiệc VIP từ 10–60 khách.',
        img: 'assets/figma/da2f6.png'
      }
    ];

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
      tab.addEventListener('click', function () {
        applyHeroSlide(idx);
      });
    });

    var prevBtn = heroFrame.querySelector('[data-name="Previous"], [data-node-id="3375:25"]');
    var nextBtn = heroFrame.querySelector('[data-name="Next"], [data-node-id="3375:28"]');
    if (prevBtn) {
      prevBtn.style.cursor = 'pointer';
      prevBtn.addEventListener('click', function () { applyHeroSlide(currentSlide - 1); });
    }
    if (nextBtn) {
      nextBtn.style.cursor = 'pointer';
      nextBtn.addEventListener('click', function () { applyHeroSlide(currentSlide + 1); });
    }

    setInterval(function () {
      applyHeroSlide(currentSlide + 1);
    }, 6500);

    /* 6.2 Fast Booking Quick-Bar -> booking.html */
    var quickBtn = document.querySelector('[data-node-id="3346:81"]');
    if (quickBtn) {
      quickBtn.setAttribute('data-oceania-handled', '1');
      quickBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var branchEl = document.getElementById('quick-branch');
        var dateEl = document.getElementById('quick-date');
        var shiftEl = document.getElementById('quick-shift');
        var guestsEl = document.getElementById('quick-guests');
        var params = new URLSearchParams();
        if (branchEl) params.set('branch', branchEl.value);
        if (dateEl) params.set('date', dateEl.value);
        if (shiftEl) params.set('shift', shiftEl.value);
        if (guestsEl) params.set('guests', guestsEl.value);
        window.location.href = 'booking.html?' + params.toString();
      });
    }

    /* 6.3 Homepage Category Tab Filter (50+ dishes preview) with Fade-In */
    var homeTabsWrap = document.querySelector('[data-node-id="3346:121"]');
    var homeDishesGrid = document.querySelector('[data-node-id="3346:132"]');
    if (homeTabsWrap && homeDishesGrid) {
      var tabBtns = Array.from(homeTabsWrap.children);
      var dishCards = homeDishesGrid.querySelectorAll('[data-name="Featured dish"], [data-name="Dish card"]');

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
            if (cat.indexOf('cua') !== -1 || cat.indexOf('ghẹ') !== -1 || cat.indexOf('bơi bể') !== -1) {
              match = cardText.indexOf('cua') !== -1 || cardText.indexOf('tôm') !== -1 || cardText.indexOf('hàu') !== -1 || cardText.indexOf('ghẹ') !== -1 || cardText.indexOf('bào ngư') !== -1;
            } else if (cat.indexOf('bò') !== -1 || cat.indexOf('nướng') !== -1) {
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
    }
  }

  /* ==========================================================================
     7. MENU (menu.html) & DISH DETAIL (dish-detail.html)
     ========================================================================== */
  function initMenuPage() {
    var searchInp = document.getElementById('menu-search-input');
    var allDishCards = document.querySelectorAll('.oceania-desktop-view [data-name="Món ăn"], .oceania-tablet-view [data-name="Món ăn"], .oceania-mobile-view [data-name="Món ăn"]');
    if (!searchInp && allDishCards.length === 0) return;

    var activeCategory = 'all';
    var activeTaste = 'all';

    function filterMenuCards() {
      var q = searchInp ? searchInp.value.trim().toLowerCase() : '';
      var visibleCount = 0;

      allDishCards.forEach(function (card) {
        var text = getText(card).toLowerCase();
        var matchSearch = !q || text.indexOf(q) !== -1;
        var matchCat = true;
        if (activeCategory !== 'all') {
          if (activeCategory.indexOf('cua') !== -1 || activeCategory.indexOf('hải sản') !== -1) {
            matchCat = text.indexOf('cua') !== -1 || text.indexOf('tôm') !== -1 || text.indexOf('ghẹ') !== -1 || text.indexOf('hàu') !== -1 || text.indexOf('bề bề') !== -1 || text.indexOf('bào ngư') !== -1 || text.indexOf('ốc') !== -1 || text.indexOf('mực') !== -1;
          } else if (activeCategory.indexOf('bò') !== -1 || activeCategory.indexOf('nướng') !== -1) {
            matchCat = text.indexOf('bò') !== -1 || text.indexOf('sườn') !== -1 || text.indexOf('wagyu') !== -1 || text.indexOf('nướng') !== -1 || text.indexOf('cừu') !== -1;
          } else if (activeCategory.indexOf('dimsum') !== -1 || activeCategory.indexOf('sashimi') !== -1) {
            matchCat = text.indexOf('sashimi') !== -1 || text.indexOf('há cảo') !== -1 || text.indexOf('dimsum') !== -1 || text.indexOf('xíu mại') !== -1 || text.indexOf('cá hồi') !== -1 || text.indexOf('bánh bao') !== -1;
          } else if (activeCategory.indexOf('lẩu') !== -1 || activeCategory.indexOf('tráng miệng') !== -1) {
            matchCat = text.indexOf('lẩu') !== -1 || text.indexOf('tomyum') !== -1 || text.indexOf('chè') !== -1 || text.indexOf('bánh') !== -1 || text.indexOf('kem') !== -1 || text.indexOf('trái cây') !== -1;
          }
        }
        var matchTaste = true;
        if (activeTaste === 'best' || activeTaste.indexOf('đầu bếp') !== -1) {
          matchTaste = text.indexOf('cua') !== -1 || text.indexOf('tôm hùm') !== -1 || text.indexOf('wagyu') !== -1 || text.indexOf('sashimi') !== -1 || text.indexOf('bào ngư') !== -1;
        } else if (activeTaste === 'grill' || activeTaste.indexOf('nướng') !== -1) {
          matchTaste = text.indexOf('nướng') !== -1 || text.indexOf('đút lò') !== -1 || text.indexOf('áp chảo') !== -1;
        } else if (activeTaste === 'steam' || activeTaste.indexOf('hấp') !== -1) {
          matchTaste = text.indexOf('hấp') !== -1 || text.indexOf('lẩu') !== -1 || text.indexOf('sashimi') !== -1 || text.indexOf('bơi bể') !== -1;
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

    if (searchInp) {
      var urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('q')) {
        searchInp.value = urlParams.get('q');
      }
      searchInp.addEventListener('input', filterMenuCards);
      if (searchInp.value) filterMenuCards();
    }

    /* Clear search button on menu.html */
    var clearSearchBtn = document.querySelector('[data-node-id="3375:241"]');
    if (clearSearchBtn && searchInp) {
      clearSearchBtn.style.cursor = 'pointer';
      clearSearchBtn.addEventListener('click', function () {
        searchInp.value = '';
        activeCategory = 'all';
        activeTaste = 'all';
        filterMenuCards();
      });
    }

    /* Sticky Category Tabs on menu.html (3375:243) */
    document.querySelectorAll('[data-node-id="3375:243"] > div, [data-name="Bộ lọc danh mục"] > div').forEach(function (tab) {
      tab.style.cursor = 'pointer';
      tab.addEventListener('click', function () {
        var txt = getText(tab).toLowerCase();
        if (txt.indexOf('tất cả') !== -1 || txt.indexOf('toàn bộ') !== -1) activeCategory = 'all';
        else activeCategory = txt;

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

    /* Native Figma Taste Pills (3375:258) */
    document.querySelectorAll('[data-node-id="3375:258"] > div, [data-name="Bộ lọc khẩu vị"] > div').forEach(function (pill) {
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
            if (sib.getAttribute('data-name') === 'Bộ lọc') {
              sib.style.backgroundColor = '#ffffff';
              var sp = sib.querySelector('p');
              if (sp) sp.style.color = '#1e293b';
            }
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

  function initDishDetailPage() {
    var nutriBox = document.getElementById('oceania-nutrition-panel');
    if (!nutriBox) return;

    var params = new URLSearchParams(window.location.search);
    var requestedDish = params.get('dish');
    var record = findDishRecord(requestedDish || 'Tôm hùm bông nướng phô mai đút lò');

    var mainHeroImg = document.querySelector('[data-node-id="3361:13764"] img');
    if (mainHeroImg && record.image) {
      mainHeroImg.src = record.image;
    }

    var titleNode = document.querySelector('[data-node-id="3361:13772"] p');
    if (titleNode) {
      titleNode.textContent = record.title;
    }

    var descNode = document.querySelector('[data-node-id="3361:13773"] p');
    if (descNode) {
      descNode.textContent = record.desc;
    }

    var stationNode = document.querySelector('[data-node-id="3361:13777"] p');
    if (stationNode && record.station) {
      stationNode.textContent = record.station;
    }

    var kcalEl = document.getElementById('nutri-kcal');
    var proEl = document.getElementById('nutri-protein');
    var fatEl = document.getElementById('nutri-fat');
    var minEl = document.getElementById('nutri-minerals');
    var algEl = document.getElementById('nutri-allergen');
    var sauceEl = document.getElementById('nutri-sauce');

    if (kcalEl) kcalEl.textContent = record.kcal;
    if (proEl) proEl.textContent = record.protein;
    if (fatEl) fatEl.textContent = record.fat;
    if (minEl) minEl.textContent = record.minerals;
    if (algEl) algEl.textContent = record.allergen;
    if (sauceEl) sauceEl.textContent = record.sauce;

    /* Interactive 4-Thumbnail Switcher */
    var thumbWrap = document.getElementById('dish-macro-thumbs');
    if (thumbWrap && mainHeroImg) {
      var thumbs = thumbWrap.querySelectorAll('img');
      thumbs.forEach(function (img, idx) {
        if (record.gallery && record.gallery[idx]) {
          img.src = record.gallery[idx];
        }
        img.addEventListener('click', function () {
          mainHeroImg.src = img.src;
          thumbs.forEach(function (t) { t.style.borderColor = '#e2e8f0'; });
          img.style.borderColor = '#ff5a36';
        });
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

    var adultCountEl = document.querySelector('[data-node-id="3361:12971"] p');
    var kidCountEl = document.querySelector('[data-node-id="3361:12979"] p');
    var babyCountEl = document.querySelector('[data-node-id="3361:12987"] p');

    function getUnitPrice() {
      var shiftTxt = shiftSel ? shiftSel.value : '';
      var dayTxt = daySel ? daySel.value : '';
      if (shiftTxt.indexOf('569') !== -1) return 569000;
      if (shiftTxt.indexOf('369') !== -1 || (shiftTxt.indexOf('Trưa') !== -1 && dayTxt.indexOf('Thứ 2') !== -1)) return 369000;
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

      var r1Label = document.querySelector('[data-node-id="3361:12993"] p');
      var r1Val = document.querySelector('[data-node-id="3361:12994"] p');
      if (r1Label) r1Label.textContent = calcState.adults + ' Người lớn × ' + fmtVnd(unit);
      if (r1Val) r1Val.textContent = fmtVnd(adultSub);

      var r2Label = document.querySelector('[data-node-id="3361:12996"] p');
      var r2Val = document.querySelector('[data-node-id="3361:12997"] p');
      if (r2Label) r2Label.textContent = calcState.kids + ' Trẻ em (1m–1.3m) × ' + fmtVnd(kidUnit);
      if (r2Val) r2Val.textContent = fmtVnd(kidSub);

      var vatVal = document.querySelector('[data-node-id="3361:13000"] p');
      if (vatVal) vatVal.textContent = fmtVnd(vat);

      var totalVal = document.querySelector('[data-node-id="3361:13005"] p');
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
    if (flashBtn) {
      flashBtn.addEventListener('click', function () {
        openModal('modal-s14');
      });
    }

    /* Filter Promo Cards on promotions.html (3361:13145) */
    var promoFilterWrap = document.querySelector('[data-node-id="3361:13145"]');
    var promoCards = document.querySelectorAll('.oceania-desktop-view [data-name="Thẻ ưu đãi"]');
    if (promoFilterWrap && promoCards.length > 0) {
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

          promoCards.forEach(function (card) {
            var t = getText(card).toLowerCase();
            var show = cat.indexOf('tất cả') !== -1 ||
              (cat.indexOf('đoàn') !== -1 && t.indexOf('đoàn') !== -1) ||
              (cat.indexOf('sinh nhật') !== -1 && t.indexOf('sinh nhật') !== -1) ||
              (cat.indexOf('thành viên') !== -1 && (t.indexOf('club') !== -1 || t.indexOf('thẻ') !== -1 || t.indexOf('trưa') !== -1));
            card.style.display = show ? '' : 'none';
          });
        });
      });
    }

    /* Open S14 Promo Modal when clicking "Nhận mã ưu đãi" on promo cards */
    document.querySelectorAll('[data-name="Nút nhận ưu đãi"]').forEach(function (btn) {
      btn.setAttribute('data-oceania-handled', '1');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal('modal-s14');
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
          if (navigator.clipboard) navigator.clipboard.writeText('OCN-10TANG1');
          showToast('Đã sao chép mã ưu đãi OCN-10TANG1 vào bộ nhớ tạm!');
        } else if (txt.indexOf('Áp dụng') !== -1 || txt.indexOf('Đặt bàn') !== -1) {
          window.location.href = 'booking.html?promo=OCN-10TANG1';
        } else if (txt.indexOf('Đóng') !== -1) {
          closeModal('modal-s14');
        }
      });
    }

    /* Group Party Form Submission (3361:13249) -> S15 */
    var partyBtn = document.querySelector('[data-node-id="3361:13249"]');
    if (partyBtn) {
      partyBtn.setAttribute('data-oceania-handled', '1');
      partyBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var nameInp = document.getElementById('promo-party-name');
        var phoneInp = document.getElementById('promo-party-phone');
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
    }
  }

  /* ==========================================================================
     10. BLOG (blog.html) & POST DETAIL (post-detail.html)
     ========================================================================== */
  function initBlogAndPostDetail() {
    var blogSearch = document.getElementById('blog-search-input');
    var blogFilterWrap = document.querySelector('[data-node-id="3361:13380"]');
    var blogCards = document.querySelectorAll('.oceania-desktop-view [data-name="Bài viết"]');

    if (blogSearch && blogCards.length > 0) {
      blogSearch.addEventListener('input', function () {
        var q = blogSearch.value.trim().toLowerCase();
        blogCards.forEach(function (card) {
          var t = getText(card).toLowerCase();
          card.style.display = (!q || t.indexOf(q) !== -1) ? '' : 'none';
        });
      });
    }

    if (blogFilterWrap && blogCards.length > 0) {
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

          blogCards.forEach(function (card) {
            var t = getText(card).toLowerCase();
            var show = cat.indexOf('tất cả') !== -1 || t.indexOf(cat.slice(0, 6)) !== -1;
            card.style.display = show ? '' : 'none';
          });
        });
      });
    }

    /* Post Detail Dynamic Title from ?post=... */
    var params = new URLSearchParams(window.location.search);
    var postParam = params.get('post');
    if (postParam) {
      var h1Node = document.querySelector('[data-node-id="3361:13556"] p');
      if (h1Node) h1Node.textContent = postParam;
    }

    /* Post Detail Live Comment Submission (3361:13648) */
    var submitCommentBtn = document.querySelector('[data-node-id="3361:13648"]');
    var commentInp = document.getElementById('post-comment-text');
    var commentName = document.getElementById('post-comment-name');
    var commentList = document.getElementById('post-comments-section');
    if (submitCommentBtn && commentInp) {
      submitCommentBtn.setAttribute('data-oceania-handled', '1');
      submitCommentBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var author = commentName && commentName.value.trim() ? commentName.value.trim() : 'Thực khách Oceania';
        var content = commentInp.value.trim();
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
        commentInp.value = '';
        showToast('Cảm ơn bạn! Bình luận của bạn đã được đăng lên Cẩm nang Ẩm thực.');
      });
    }
  }

  /* ==========================================================================
     11. LOCATIONS PAGE (locations.html): GOOGLE MAPS SWITCHER & CONTACT FORM
     ========================================================================== */
  function initLocationsPage() {
    var mapIframe = document.getElementById('oceania-gmap-iframe');
    var extMapBtn = document.getElementById('oceania-ext-maps-btn');

    document.querySelectorAll('.oceania-map-branch-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
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
        showToast('Đã chuyển bản đồ vệ tinh sang: ' + getText(btn));
      });
    });

    /* Contact Form Validation (S19) & Success (S20) */
    var sendBtn = document.querySelector('#contact-pane-default [data-node-id="3361:14267"]');
    if (sendBtn) {
      sendBtn.setAttribute('data-oceania-handled', '1');
      sendBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var nameInp = document.getElementById('contact-name');
        var phoneInp = document.getElementById('contact-phone');
        var msgInp = document.getElementById('contact-message');
        var nameVal = nameInp ? nameInp.value.trim() : '';
        var phoneVal = phoneInp ? phoneInp.value.trim().replace(/\s+/g, '') : '';
        var msgVal = msgInp ? msgInp.value.trim() : '';

        if (!nameVal || !/^0\d{9}$/.test(phoneVal) || !msgVal) {
          showToast('Vui lòng điền đầy đủ Họ tên, SĐT 10 số hợp lệ và Nội dung liên hệ.');
          return;
        }
        document.querySelectorAll('.oceania-contact-pane').forEach(function (p) {
          p.classList.remove('active');
        });
        var s20 = document.getElementById('contact-pane-success');
        if (s20) s20.classList.add('active');
        showToast('Đã gửi thông tin liên hệ tới Ban Quản Lý Oceania TP.HCM!');
      });
    }
  }

  /* ==========================================================================
     12. REVIEWS & VIP PAGE (reviews.html): FILTER, VERIFY BOOKING & POST REVIEW
     ========================================================================== */
  function initReviewsPage() {
    /* Review Category Filter (3361:14501) */
    var revFilterWrap = document.querySelector('[data-node-id="3361:14501"]');
    var revCards = document.querySelectorAll('.oceania-desktop-view [data-name="Thẻ đánh giá"]');
    if (revFilterWrap && revCards.length > 0) {
      Array.from(revFilterWrap.children).forEach(function (pill) {
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

          revCards.forEach(function (card) {
            var t = getText(card).toLowerCase();
            var show = cat.indexOf('tất cả') !== -1 || cat.indexOf('5 sao') !== -1 || t.indexOf(cat.slice(0, 6)) !== -1;
            card.style.display = show ? '' : 'none';
          });
        });
      });
    }

    /* Verify Booking Code (3361:14594) -> Open S17 Write Review Modal or S16 Error */
    var verifyBtn = document.querySelector('#review-pane-default [data-node-id="3361:14594"]');
    if (verifyBtn) {
      verifyBtn.setAttribute('data-oceania-handled', '1');
      verifyBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var codeInp = document.getElementById('review-booking-code');
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
    }

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

    /* Submit Review inside Default Pane (3361:14608) or Modal S17 (3375:39304) -> S18 */
    document.querySelectorAll('[data-node-id="3361:14608"], #modal-s17 [data-node-id="3375:39304"]').forEach(function (btn) {
      btn.setAttribute('data-oceania-handled', '1');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        closeModal('modal-s17');
        document.querySelectorAll('.oceania-review-pane').forEach(function (p) {
          p.classList.remove('active');
        });
        var s18 = document.getElementById('review-pane-submitted');
        if (s18) s18.classList.add('active');
        showToast('Cảm ơn đánh giá 5 sao của bạn! +100 điểm thưởng Oceania Club đã được cộng.');
      });
    });
  }

  /* ==========================================================================
     13. CAREERS PAGE (careers.html): JOB FILTERS, JD ACCORDION & ONLINE CV FORM (S26)
     ========================================================================== */
  function initCareersPage() {
    var deptWrap = document.querySelector('[data-node-id="3483:86"]');
    var branchWrap = document.querySelector('[data-node-id="3483:95"]');
    var jobListWrap = document.querySelector('[data-node-id="3483:118"]');
    if (!deptWrap && !jobListWrap) return;

    var jobCards = jobListWrap ? Array.from(jobListWrap.children) : [];

    if (deptWrap && jobCards.length > 0) {
      Array.from(deptWrap.children).forEach(function (pill) {
        pill.style.cursor = 'pointer';
        pill.addEventListener('click', function () {
          var cat = getText(pill).toLowerCase();
          Array.from(deptWrap.children).forEach(function (sib) {
            sib.style.backgroundColor = '#ffffff';
            var sp = sib.querySelector('p');
            if (sp) sp.style.color = '#1e293b';
          });
          pill.style.backgroundColor = '#07192f';
          var pp = pill.querySelector('p');
          if (pp) pp.style.color = '#f8f9fa';

          jobCards.forEach(function (card) {
            var t = getText(card).toLowerCase();
            var show = cat.indexOf('tất cả') !== -1 ||
              (cat.indexOf('bếp') !== -1 && t.indexOf('bếp') !== -1) ||
              (cat.indexOf('sảnh') !== -1 && (t.indexOf('sảnh') !== -1 || t.indexOf('phục vụ') !== -1 || t.indexOf('lễ tân') !== -1)) ||
              (cat.indexOf('quản lý') !== -1 && (t.indexOf('giám sát') !== -1 || t.indexOf('quản lý') !== -1 || t.indexOf('trưởng') !== -1));
            card.style.display = show ? '' : 'none';
          });
        });
      });
    }

    if (branchWrap && jobCards.length > 0) {
      Array.from(branchWrap.children).forEach(function (pill) {
        pill.style.cursor = 'pointer';
        pill.addEventListener('click', function () {
          var loc = getText(pill).toLowerCase();
          Array.from(branchWrap.children).forEach(function (sib) {
            sib.style.backgroundColor = '#ffffff';
            var sp = sib.querySelector('p');
            if (sp) sp.style.color = '#1e293b';
          });
          pill.style.backgroundColor = '#ff5a36';
          var pp = pill.querySelector('p');
          if (pp) pp.style.color = '#ffffff';

          jobCards.forEach(function (card) {
            var t = getText(card).toLowerCase();
            var show = loc.indexOf('tất cả') !== -1 || t.indexOf('toàn hệ thống') !== -1 ||
              (loc.indexOf('vincom') !== -1 && t.indexOf('vincom') !== -1) ||
              (loc.indexOf('lotte') !== -1 && t.indexOf('lotte') !== -1) ||
              (loc.indexOf('cantavil') !== -1 && t.indexOf('cantavil') !== -1);
            card.style.display = show ? '' : 'none';
          });
        });
      });
    }

    /* Click "Ứng tuyển ngay" on job cards -> pre-fill #cv-role and scroll to CV form */
    document.querySelectorAll('[data-name="Nút ứng tuyển"]').forEach(function (btn) {
      btn.setAttribute('data-oceania-handled', '1');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var card = btn.closest('[data-node-id]');
        var roleSel = document.getElementById('cv-role');
        if (card && roleSel) {
          var cardTxt = getText(card);
          Array.from(roleSel.options).forEach(function (opt) {
            if (cardTxt.indexOf(opt.value.split('—')[0].trim()) !== -1) {
              roleSel.value = opt.value;
            }
          });
        }
        var formSec = document.querySelector('[data-node-id="3483:222"]');
        if (formSec) formSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast('Đã chọn vị trí ứng tuyển. Vui lòng điền thông tin hồ sơ bên dưới.');
      });
    });

    /* Online CV Form Submit (3483:271) -> S26 */
    var submitCvBtn = document.querySelector('[data-node-id="3483:271"]');
    if (submitCvBtn) {
      submitCvBtn.setAttribute('data-oceania-handled', '1');
      submitCvBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var nameInp = document.getElementById('cv-name');
        var phoneInp = document.getElementById('cv-phone');
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
    }
  }

  /* ==========================================================================
     14. FAQ ACCORDION CONTROLLER (SHARED ACROSS PRICING, LOCATIONS, ETC.)
     ========================================================================== */
  function initFaqAccordions() {
    document.querySelectorAll('[data-name="Câu hỏi"]').forEach(function (faqCard) {
      faqCard.addEventListener('click', function () {
        var ps = faqCard.querySelectorAll('p');
        if (ps.length >= 2) {
          var ans = ps[ps.length - 1];
          var isHidden = ans.style.display === 'none';
          ans.style.display = isHidden ? '' : 'none';
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
    initMenuPage();
    initDishDetailPage();
    initPricingPage();
    initPromotionsPage();
    initBlogAndPostDetail();
    initLocationsPage();
    initReviewsPage();
    initCareersPage();
    initFaqAccordions();
  });
})();
