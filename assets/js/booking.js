/**
 * OCEANIA SEAFOOD & BBQ BUFFET — 3-STEP BOOKING WIZARD ENGINE (booking.js)
 * ------------------------------------------------------------------------
 * Implements the interactive 3-Step Reservation Wizard on booking.html:
 *  - Step 1: Select HCMC Branch (Vincom Đồng Khởi Q1, Lotte Mart Q7, Cantavil Thủ Đức)
 *            -> Dynamically updates hall preview image, branch title & address across all steps.
 *  - Step 2: Select Date, Meal Shift & Guest Count
 *            -> Real-time table availability calculation ("Còn 12 bàn trống", "Còn 5 bàn trống", "Sắp kín")
 *               and live estimated bill calculation.
 *  - Step 3: Customer Information, 10-digit Vietnamese Phone Validation (^0\d{9}$),
 *            Special Seating Requests -> Generates unique OCN-XXXXXX booking code & SVG QR Code,
 *            saves to localStorage, and opens Confirmation Modal S04.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var step1Pane = document.getElementById('booking-step-1');
    var step2Pane = document.getElementById('booking-step-2');
    var step3Pane = document.getElementById('booking-step-3');
    var step3ErrorPane = document.getElementById('booking-step-3-error');
    if (!step1Pane || !step2Pane || !step3Pane) return;

    var app = window.OceaniaApp;
    var BRANCH_DATA = app.BRANCH_DATA;

    /* Booking Wizard State */
    var wizardState = {
      branchKey: 'Vincom Đồng Khởi Q1',
      branchName: 'Vincom Đồng Khởi, Quận 1',
      address: 'Tầng B3, Vincom Center Đồng Khởi, 72 Lê Thánh Tôn, Quận 1, TP.HCM',
      hallImage: 'assets/figma/da2f6.png',
      date: 'Thứ Bảy, 31/10/2026',
      time: '19:00',
      shift: '19:00 (Ca tối Buffet Thượng Hạng)',
      adults: 4,
      kids: 1,
      babies: 1,
      tier: 469000,
      seating: ['Gần bể hải sản', 'Ghế trẻ em'],
      name: '',
      phone: '',
      email: '',
      note: '',
      code: 'OCN-311026-001'
    };

    /* Pre-fill from URL query parameters (?branch=...&date=...&shift=...&guests=...) */
    var params = new URLSearchParams(window.location.search);
    if (params.get('branch')) {
      var bParam = params.get('branch');
      if (bParam.indexOf('Lotte') !== -1 || bParam.indexOf('Q7') !== -1 || bParam.indexOf('Quận 7') !== -1) {
        wizardState.branchKey = 'Lotte Mart Q7';
      } else if (bParam.indexOf('Cantavil') !== -1 || bParam.indexOf('Thủ Đức') !== -1) {
        wizardState.branchKey = 'Cantavil Thủ Đức';
      } else {
        wizardState.branchKey = 'Vincom Đồng Khởi Q1';
      }
    }
    if (params.get('date')) wizardState.date = params.get('date');
    if (params.get('shift')) {
      wizardState.shift = params.get('shift');
      var mTime = wizardState.shift.match(/(\d{2}:\d{2})/);
      if (mTime) wizardState.time = mTime[1];
    }
    if (params.get('guests')) {
      var gMatch = params.get('guests').match(/(\d+)/);
      if (gMatch) wizardState.adults = Math.max(1, parseInt(gMatch[1], 10));
    }
    if (params.get('tier')) {
      var tVal = parseInt(params.get('tier'), 10);
      if (tVal === 369000 || tVal === 469000 || tVal === 569000) wizardState.tier = tVal;
    }

    function applyBranchSelection(key) {
      var info = BRANCH_DATA[key] || BRANCH_DATA['Vincom Đồng Khởi Q1'];
      wizardState.branchKey = key;
      wizardState.branchName = info.name;
      wizardState.address = info.address;
      wizardState.hallImage = info.image;

      /* Highlight selected branch card in Step 1 */
      var branchCards = step1Pane.querySelectorAll('[data-name="Lựa chọn cơ sở"] > div');
      branchCards.forEach(function (card) {
        card.style.cursor = 'pointer';
        var txt = app.getText(card);
        var isMatch =
          (key === 'Vincom Đồng Khởi Q1' && (txt.indexOf('Vincom') !== -1 || txt.indexOf('Đồng Khởi') !== -1)) ||
          (key === 'Lotte Mart Q7' && (txt.indexOf('Lotte') !== -1 || txt.indexOf('Quận 7') !== -1 || txt.indexOf('Q7') !== -1)) ||
          (key === 'Cantavil Thủ Đức' && (txt.indexOf('Cantavil') !== -1 || txt.indexOf('Thủ Đức') !== -1));

        card.style.borderColor = isMatch ? '#d4af37' : '#e2e8f0';
        card.style.backgroundColor = isMatch ? '#f8f9fa' : '#ffffff';
        card.style.boxShadow = isMatch ? '0 8px 20px rgba(7, 25, 47, 0.10)' : 'none';
        var ps = card.querySelectorAll('p');
        ps.forEach(function (p) {
          var pt = app.getText(p);
          if (pt.indexOf('Đã chọn') !== -1 || pt.indexOf('Chọn cơ sở') !== -1) {
            p.textContent = isMatch ? '◉ Đã chọn' : '○ Chọn cơ sở';
          }
        });
      });

      /* Update Hall Preview Image in Step 1 Summary Sidebar */
      var previewImg = step1Pane.querySelector('[data-name="Tóm tắt"] img');
      if (previewImg && info.image) {
        previewImg.style.opacity = '0.4';
        setTimeout(function () {
          previewImg.src = info.image;
          previewImg.style.opacity = '1';
        }, 120);
      }

      syncAllSummaryPanels();
    }

    function getEstimatedTotal() {
      var unit = wizardState.tier || ((wizardState.time < '15:00' || wizardState.shift.toLowerCase().indexOf('trưa') !== -1) ? 369000 : 469000);
      var kidUnit = Math.round(unit * 0.5);
      var sub = wizardState.adults * unit + wizardState.kids * kidUnit;
      var discount = wizardState.adults >= 10 ? unit : 0;
      var vat = Math.round((sub - discount) * 0.08);
      return app.fmtVnd(sub - discount + vat);
    }

    function getRealtimeTableStatus() {
      var totalGuests = wizardState.adults + wizardState.kids + wizardState.babies;
      if (wizardState.time === '19:00' || wizardState.time === '19:30') {
        return totalGuests > 8 ? 'Còn 3 bàn lớn khu bể hải sản (' + totalGuests + ' chỗ)' : 'Còn 8 bàn trống • Khu bể hải sản';
      }
      if (wizardState.time < '14:00') {
        return 'Còn 14 bàn trống • Sảnh chính Q1/Q7/Thủ Đức';
      }
      return 'Còn 12 bàn trống • Sẵn sàng đón ' + totalGuests + ' khách';
    }

    function syncAllSummaryPanels() {
      var estTotal = getEstimatedTotal();
      var totalSeats = wizardState.adults + wizardState.kids + wizardState.babies;
      var guestSummary = wizardState.adults + ' người lớn' +
        (wizardState.kids > 0 ? (', ' + wizardState.kids + ' trẻ em') : '') +
        (wizardState.babies > 0 ? (', ' + wizardState.babies + ' trẻ <1m') : '') +
        ' (Tổng ' + totalSeats + ' chỗ)';
      var tableAvail = getRealtimeTableStatus();
      var tierLabel = wizardState.tier === 369000 ? 'Buffet Trưa 369K' : (wizardState.tier === 569000 ? 'Buffet VIP Tôm Hùm 569K' : 'Buffet Tối 469K');

      [step1Pane, step2Pane, step3Pane, step3ErrorPane].forEach(function (pane) {
        if (!pane) return;
        pane.querySelectorAll('p').forEach(function (p) {
          var t = app.getText(p);
          if ((t.indexOf('Vincom Đồng Khởi') !== -1 || t.indexOf('Lotte Mart') !== -1 || t.indexOf('Cantavil Premier') !== -1) && !p.closest('[data-name="Lựa chọn cơ sở"]')) {
            p.textContent = wizardState.branchName;
          } else if ((t.indexOf('người lớn') !== -1 || t.indexOf('Tổng ') !== -1 && t.indexOf('chỗ') !== -1) && !p.closest('[data-name="Bộ đếm khách"]')) {
            if (p.getAttribute('data-node-id') === '3375:38453') {
              p.textContent = 'Tổng ' + totalSeats + ' chỗ ngồi (' + wizardState.adults + ' người lớn, ' + wizardState.kids + ' trẻ 1–1.3m, ' + wizardState.babies + ' trẻ <1m). ' + (wizardState.adults >= 10 ? '✓ Đang áp dụng ưu đãi Đi 10 Tặng 1!' : 'Trẻ dưới 1m được miễn phí.');
            } else {
              p.textContent = guestSummary + ' · ' + tierLabel;
            }
          } else if ((t.indexOf('Thứ ') !== -1 || t.indexOf('Chủ Nhật') !== -1) && t.indexOf('2026') !== -1 && p.closest('[data-name="Tóm tắt"]')) {
            p.textContent = wizardState.date + ' · ' + wizardState.time + ' (' + tierLabel + ')';
          } else if (t.indexOf('Còn ') !== -1 && t.indexOf('bàn') !== -1 && !p.closest('[data-name="Khung giờ"]')) {
            p.textContent = '● ' + tableAvail;
          } else if ((t === '—' || /^\d[\d.]*đ$/.test(t)) && p.closest('[data-name="Tóm tắt"]')) {
            p.textContent = estTotal;
          } else if (t.indexOf('tài liệu không nêu') !== -1) {
            p.textContent = 'Đã bao gồm VAT 8% · Trẻ dưới 1m miễn phí · Đi 10 Tặng 1.';
          } else if (t.indexOf('Chưa chọn') !== -1 && t.indexOf('Số khách:') !== -1) {
            p.textContent = 'Số khách: ' + guestSummary;
          } else if (t.indexOf('Giá tham khảo:') !== -1) {
            p.textContent = 'Gói: ' + tierLabel + ' · Tạm tính: ' + estTotal;
          }
        });
      });

      /* Update Guest Counters in Step 2 (3375:38440, 3375:38445, 3375:38450 are <p> nodes directly) */
      var adultCountNode = step2Pane.querySelector('[data-node-id="3375:38440"]');
      var kidCountNode = step2Pane.querySelector('[data-node-id="3375:38445"]');
      var babyCountNode = step2Pane.querySelector('[data-node-id="3375:38450"]');
      if (adultCountNode) adultCountNode.textContent = String(wizardState.adults);
      if (kidCountNode) kidCountNode.textContent = String(wizardState.kids);
      if (babyCountNode) babyCountNode.textContent = String(wizardState.babies);

      /* Sync inline Step 1 / Mobile / Tablet quick-counters */
      document.querySelectorAll('[data-oceania-counter="adults"]').forEach(function (el) { el.textContent = String(wizardState.adults); });
      document.querySelectorAll('[data-oceania-counter="kids"]').forEach(function (el) { el.textContent = String(wizardState.kids); });
      document.querySelectorAll('[data-oceania-counter="babies"]').forEach(function (el) { el.textContent = String(wizardState.babies); });
      document.querySelectorAll('[data-oceania-counter="total"]').forEach(function (el) { el.textContent = estTotal + ' (' + totalSeats + ' chỗ)'; });
      document.querySelectorAll('[data-oceania-tier]').forEach(function (btn) {
        var val = parseInt(btn.getAttribute('data-oceania-tier'), 10);
        var active = val === wizardState.tier;
        btn.style.backgroundColor = active ? '#07192f' : '#ffffff';
        btn.style.color = active ? '#f8f9fa' : '#07192f';
        btn.style.borderColor = active ? '#d4af37' : '#e2e8f0';
      });

      /* Update Estimated Total in Step 1, Step 2 & Step 3 */
      document.querySelectorAll('[data-node-id="3375:38471"], [data-node-id="3504:75"], [data-node-id="3375:38547"]').forEach(function (p) {
        p.textContent = estTotal;
      });
    }

    function switchToStep(stepNum) {
      [step1Pane, step2Pane, step3Pane].forEach(function (pane, idx) {
        pane.classList.toggle('active', idx + 1 === stepNum);
      });
      if (step3ErrorPane) step3ErrorPane.classList.remove('active');
      syncAllSummaryPanels();
      var wizardWrap = document.getElementById('oceania-booking-wizard');
      if (wizardWrap) {
        wizardWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    /* 1. Stepper Header Clicks (Bước 1, Bước 2, Bước 3) */
    document.querySelectorAll('[data-name="Bước đặt bàn"]').forEach(function (stepBox) {
      stepBox.addEventListener('click', function () {
        var txt = app.getText(stepBox);
        if (txt.indexOf('1') !== -1 || txt.indexOf('Chi nhánh') !== -1 || txt.indexOf('Cơ sở') !== -1) switchToStep(1);
        else if (txt.indexOf('2') !== -1 || txt.indexOf('Ngày') !== -1 || txt.indexOf('Số khách') !== -1) switchToStep(2);
        else if (txt.indexOf('3') !== -1 || txt.indexOf('Thông tin') !== -1 || txt.indexOf('Xác nhận') !== -1) switchToStep(3);
      });
    });

    /* 2. Step 1: Select HCMC Branch Card -> Update Hall Image & Branch Info */
    step1Pane.querySelectorAll('[data-name="Lựa chọn cơ sở"] > div').forEach(function (card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function () {
        var txt = app.getText(card);
        var key = 'Vincom Đồng Khởi Q1';
        if (txt.indexOf('Lotte') !== -1 || txt.indexOf('Quận 7') !== -1 || txt.indexOf('Q7') !== -1) {
          key = 'Lotte Mart Q7';
        } else if (txt.indexOf('Cantavil') !== -1 || txt.indexOf('Thủ Đức') !== -1) {
          key = 'Cantavil Thủ Đức';
        }
        applyBranchSelection(key);
        app.showToast('Đã chọn cơ sở: ' + BRANCH_DATA[key].name);
      });
    });

    /* Step 1 -> Step 2 CTA Button */
    step1Pane.querySelectorAll('[data-name*="Nút"], [data-node-id="3379:39641"]').forEach(function (btn) {
      var txt = app.getText(btn);
      if (txt.indexOf('Tiếp tục') !== -1 || txt.indexOf('ngày') !== -1 || txt.indexOf('Bước 2') !== -1) {
        btn.setAttribute('data-oceania-handled', '1');
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          switchToStep(2);
        });
      }
    });

    /* 3. Step 2: Date Selection, Time Slot Selection (Real-time Table Availability) & Guest Counters */
    step2Pane.querySelectorAll('[data-name="Ngày"]').forEach(function (dateCard) {
      dateCard.addEventListener('click', function () {
        step2Pane.querySelectorAll('[data-name="Ngày"]').forEach(function (d) {
          d.style.backgroundColor = '#ffffff';
          d.style.borderColor = '#e2e8f0';
          d.querySelectorAll('p').forEach(function (p) { p.style.color = '#1e293b'; });
        });
        dateCard.style.backgroundColor = '#07192f';
        dateCard.style.borderColor = '#d4af37';
        dateCard.querySelectorAll('p').forEach(function (p) { p.style.color = '#f8f9fa'; });
        wizardState.date = app.getText(dateCard);
        syncAllSummaryPanels();
      });
    });

    step2Pane.querySelectorAll('[data-name="Khung giờ"]').forEach(function (slotCard) {
      slotCard.addEventListener('click', function () {
        var txt = app.getText(slotCard);
        if (txt.indexOf('Hết bàn') !== -1 || txt.indexOf('Tạm kín') !== -1) {
          app.showToast('Khung giờ này hiện đã kín bàn trực tuyến. Vui lòng chọn khung giờ bên cạnh!');
          return;
        }
        step2Pane.querySelectorAll('[data-name="Khung giờ"]').forEach(function (s) {
          s.style.backgroundColor = '#ffffff';
          s.style.borderColor = '#e2e8f0';
          s.querySelectorAll('p').forEach(function (p) { p.style.color = '#1e293b'; });
        });
        slotCard.style.backgroundColor = '#07192f';
        slotCard.style.borderColor = '#d4af37';
        slotCard.querySelectorAll('p').forEach(function (p) { p.style.color = '#f8f9fa'; });

        var m = txt.match(/(\d{2}:\d{2})/);
        if (m) wizardState.time = m[1];
        wizardState.shift = wizardState.time < '15:00'
          ? wizardState.time + ' (Ca trưa Buffet Tiêu Chuẩn)'
          : wizardState.time + ' (Ca tối Buffet Thượng Hạng)';
        syncAllSummaryPanels();
        app.showToast('Đã chọn giờ hẹn ' + wizardState.time + ' — ' + getRealtimeTableStatus());
      });
    });

    /* Helper to style stepper buttons & build inline Guest/Tier bar inside Step 1 & Mobile/Tablet */
    function adjustGuest(key, delta, min, max) {
      wizardState[key] = Math.max(min, Math.min(max, wizardState[key] + delta));
      syncAllSummaryPanels();
    }

    function buildInlineGuestTierWidget() {
      var box = document.createElement('div');
      box.className = 'bg-[#f8f9fa] border border-[#e2e8f0] p-[18px] rounded-[2px] w-full flex flex-col gap-[14px]';
      box.setAttribute('data-name', 'Điều chỉnh nhanh khách & gói');
      box.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">' +
        '<p style="font-size:13px;font-weight:700;color:#07192f;letter-spacing:0.6px;text-transform:uppercase;">Số lượng người đi &amp; Gói Buffet dự kiến</p>' +
        '<span data-oceania-counter="total" style="font-size:13px;font-weight:700;color:#ff5a36;"></span>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:10px;">' +
          '<div style="background:#fff;border:1px solid #e2e8f0;padding:10px 12px;border-radius:2px;display:flex;align-items:center;justify-content:space-between;">' +
            '<div><p style="font-size:13px;font-weight:600;color:#1e293b;">Người lớn (&gt;1.3m)</p><p style="font-size:11px;color:#64748b;">Tính 100% giá vé</p></div>' +
            '<div style="display:flex;align-items:center;gap:8px;">' +
              '<button type="button" data-oceania-step="adults:-1" style="width:30px;height:30px;border:1px solid #d4af37;border-radius:3px;background:#fff;color:#ff5a36;font-size:18px;font-weight:600;">−</button>' +
              '<span data-oceania-counter="adults" style="min-width:22px;text-align:center;font-weight:700;font-size:15px;color:#07192f;">4</span>' +
              '<button type="button" data-oceania-step="adults:1" style="width:30px;height:30px;border:1px solid #d4af37;border-radius:3px;background:#fff;color:#ff5a36;font-size:18px;font-weight:600;">+</button>' +
            '</div>' +
          '</div>' +
          '<div style="background:#fff;border:1px solid #e2e8f0;padding:10px 12px;border-radius:2px;display:flex;align-items:center;justify-content:space-between;">' +
            '<div><p style="font-size:13px;font-weight:600;color:#1e293b;">Trẻ em (1m–1.3m)</p><p style="font-size:11px;color:#64748b;">50% giá vé</p></div>' +
            '<div style="display:flex;align-items:center;gap:8px;">' +
              '<button type="button" data-oceania-step="kids:-1" style="width:30px;height:30px;border:1px solid #d4af37;border-radius:3px;background:#fff;color:#ff5a36;font-size:18px;font-weight:600;">−</button>' +
              '<span data-oceania-counter="kids" style="min-width:22px;text-align:center;font-weight:700;font-size:15px;color:#07192f;">1</span>' +
              '<button type="button" data-oceania-step="kids:1" style="width:30px;height:30px;border:1px solid #d4af37;border-radius:3px;background:#fff;color:#ff5a36;font-size:18px;font-weight:600;">+</button>' +
            '</div>' +
          '</div>' +
          '<div style="background:#fff;border:1px solid #e2e8f0;padding:10px 12px;border-radius:2px;display:flex;align-items:center;justify-content:space-between;">' +
            '<div><p style="font-size:13px;font-weight:600;color:#1e293b;">Trẻ nhỏ (&lt;1m)</p><p style="font-size:11px;color:#059669;">Miễn phí · Xếp ghế bé</p></div>' +
            '<div style="display:flex;align-items:center;gap:8px;">' +
              '<button type="button" data-oceania-step="babies:-1" style="width:30px;height:30px;border:1px solid #d4af37;border-radius:3px;background:#fff;color:#ff5a36;font-size:18px;font-weight:600;">−</button>' +
              '<span data-oceania-counter="babies" style="min-width:22px;text-align:center;font-weight:700;font-size:15px;color:#07192f;">1</span>' +
              '<button type="button" data-oceania-step="babies:1" style="width:30px;height:30px;border:1px solid #d4af37;border-radius:3px;background:#fff;color:#ff5a36;font-size:18px;font-weight:600;">+</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">' +
          '<span style="font-size:12px;font-weight:600;color:#64748b;margin-right:4px;">Hạng vé:</span>' +
          '<button type="button" data-oceania-tier="369000" style="padding:6px 12px;border:1px solid #e2e8f0;border-radius:2px;font-size:12px;font-weight:600;cursor:pointer;">Trưa Tiêu chuẩn 369K</button>' +
          '<button type="button" data-oceania-tier="469000" style="padding:6px 12px;border:1px solid #e2e8f0;border-radius:2px;font-size:12px;font-weight:600;cursor:pointer;">Tối Hải sản 469K</button>' +
          '<button type="button" data-oceania-tier="569000" style="padding:6px 12px;border:1px solid #e2e8f0;border-radius:2px;font-size:12px;font-weight:600;cursor:pointer;">VIP Tôm Hùm 569K</button>' +
        '</div>';

      box.addEventListener('click', function (e) {
        var stepBtn = e.target.closest('[data-oceania-step]');
        if (stepBtn) {
          var parts = stepBtn.getAttribute('data-oceania-step').split(':');
          var key = parts[0];
          var delta = parseInt(parts[1], 10);
          var min = key === 'adults' ? 1 : 0;
          var max = key === 'adults' ? 50 : (key === 'kids' ? 30 : 15);
          adjustGuest(key, delta, min, max);
          return;
        }
        var tierBtn = e.target.closest('[data-oceania-tier]');
        if (tierBtn) {
          wizardState.tier = parseInt(tierBtn.getAttribute('data-oceania-tier'), 10);
          syncAllSummaryPanels();
        }
      });
      return box;
    }

    /* Mount quick guest & tier widget right in Step 1, Tablet & Mobile booking views */
    var step1NextBtnWrap = step1Pane.querySelector('[data-node-id="3379:39641"]');
    if (step1NextBtnWrap && step1NextBtnWrap.parentElement) {
      step1NextBtnWrap.parentElement.insertBefore(buildInlineGuestTierWidget(), step1NextBtnWrap);
    }
    document.querySelectorAll('.oceania-tablet-view [data-node-id="3504:2427"], .oceania-mobile-view [data-node-id="3375:36959"]').forEach(function (tmWrap) {
      if (tmWrap.parentElement) {
        tmWrap.parentElement.insertBefore(buildInlineGuestTierWidget(), tmWrap.nextSibling);
      }
      tmWrap.querySelectorAll('[data-name="Chi nhánh"]').forEach(function (card) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function () {
          var txt = app.getText(card);
          var k = txt.indexOf('Lotte') !== -1 ? 'Lotte Mart Q7' : (txt.indexOf('Cantavil') !== -1 ? 'Cantavil Thủ Đức' : 'Vincom Đồng Khởi Q1');
          applyBranchSelection(k);
          tmWrap.querySelectorAll('[data-name="Chi nhánh"]').forEach(function (c) { c.style.borderColor = '#e2e8f0'; });
          card.style.borderColor = '#ff5a36';
          app.showToast('Đã chọn cơ sở: ' + BRANCH_DATA[k].name);
        });
      });
    });

    /* Guest +/- Buttons in Step 2 (with tactile boxed styling) */
    var guestCounterMap = [
      { minus: '3375:38439', plus: '3375:38441', key: 'adults', min: 1, max: 50 },
      { minus: '3375:38444', plus: '3375:38446', key: 'kids', min: 0, max: 30 },
      { minus: '3375:38449', plus: '3375:38451', key: 'babies', min: 0, max: 15 }
    ];
    guestCounterMap.forEach(function (cfg) {
      var mBtn = step2Pane.querySelector('[data-node-id="' + cfg.minus + '"]');
      var pBtn = step2Pane.querySelector('[data-node-id="' + cfg.plus + '"]');
      [mBtn, pBtn].forEach(function (el) {
        if (!el) return;
        el.style.cssText = 'cursor:pointer;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid #d4af37;border-radius:4px;background:#ffffff;color:#ff5a36;font-size:22px;font-weight:600;user-select:none;';
      });
      if (mBtn) {
        mBtn.addEventListener('click', function () { adjustGuest(cfg.key, -1, cfg.min, cfg.max); });
      }
      if (pBtn) {
        pBtn.addEventListener('click', function () { adjustGuest(cfg.key, 1, cfg.min, cfg.max); });
      }
    });

    /* Step 2 Back / Continue Buttons */
    step2Pane.querySelectorAll('[data-name*="Nút"]').forEach(function (btn) {
      var txt = app.getText(btn);
      if (txt.indexOf('Quay lại') !== -1) {
        btn.setAttribute('data-oceania-handled', '1');
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          switchToStep(1);
        });
      } else if (txt.indexOf('Tiếp tục') !== -1 || txt.indexOf('Bước 3') !== -1 || txt.indexOf('thông tin') !== -1) {
        btn.setAttribute('data-oceania-handled', '1');
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          switchToStep(3);
        });
      }
    });

    /* 4. Step 3: Special Seating Chips, 10-Digit Phone Validation & Submit -> Generate OCN + QR Code */
    [step3Pane, step3ErrorPane].forEach(function (pane) {
      if (!pane) return;
      pane.querySelectorAll('[data-name="Lựa chọn"]').forEach(function (chip) {
        chip.addEventListener('click', function () { 
          var label = app.getText(chip);
          var idx = wizardState.seating.indexOf(label);
          if (idx === -1) {
            wizardState.seating.push(label);
            chip.style.backgroundColor = '#07192f';
            chip.style.borderColor = '#d4af37';
            chip.querySelectorAll('p').forEach(function (p) { p.style.color = '#f8f9fa'; });
          } else {
            wizardState.seating.splice(idx, 1);
            chip.style.backgroundColor = '#ffffff';
            chip.style.borderColor = '#e2e8f0';
            chip.querySelectorAll('p').forEach(function (p) { p.style.color = '#1e293b'; });
          }
        });
      });
    });

    function completeBookingSubmission() {
      var nameInp = document.getElementById('booking-name');
      var phoneInp = document.getElementById('booking-phone');
      var emailInp = document.getElementById('booking-email');
      var noteInp = document.getElementById('booking-note');

      var nameVal = nameInp ? nameInp.value.trim() : '';
      var phoneVal = phoneInp ? phoneInp.value.trim().replace(/\s+/g, '') : '';
      var emailVal = emailInp ? emailInp.value.trim() : '';
      var noteVal = noteInp ? noteInp.value.trim() : '';

      if (!nameVal || nameVal.length < 2) {
        app.showToast('Vui lòng nhập Họ và tên người đặt bàn.');
        if (nameInp) nameInp.focus();
        return;
      }
      if (!/^0\d{9}$/.test(phoneVal)) {
        app.showToast('Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số bắt đầu bằng số 0 (VD: 0909123456).');
        if (phoneInp) phoneInp.focus();
        return;
      }

      /* Generate unique OCN-311026-XXX Booking Code */
      var randomSuffix = Math.floor(100 + Math.random() * 899);
      var newCode = 'OCN-311026-' + randomSuffix;
      wizardState.code = newCode;
      wizardState.name = nameVal;
      wizardState.phone = phoneVal;
      wizardState.email = emailVal || 'khachhang@oceaniabuffet.vn';
      wizardState.note = noteVal || 'Không có ghi chú thêm.';

      var newRecord = {
        code: newCode,
        name: wizardState.name,
        phone: wizardState.phone,
        email: wizardState.email,
        branch: wizardState.branchName,
        address: wizardState.address,
        date: wizardState.date,
        time: wizardState.time,
        shift: wizardState.shift,
        adults: wizardState.adults,
        kids: wizardState.kids,
        babies: wizardState.babies,
        seating: wizardState.seating.join(' • ') || 'Bàn tiêu chuẩn gần quầy line',
        note: wizardState.note,
        tableCode: 'Khu Hải Sản — Bàn B' + (10 + (randomSuffix % 18)),
        status: 'ĐÃ XÁC NHẬN',
        totalEst: getEstimatedTotal(),
        createdAt: Date.now()
      };

      var list = app.getBookings();
      list.unshift(newRecord);
      app.saveBookings(list);

      /* Update Confirmation Modal S04 with new Booking Code, Details & SVG QR Code */
      var modalS04 = document.getElementById('modal-s04');
      if (modalS04) {
        modalS04.querySelectorAll('p').forEach(function (p) {
          var t = app.getText(p);
          if (/^OCN-/.test(t)) {
            p.textContent = newCode;
          } else if (t.indexOf('Nguyễn Minh Khôi') !== -1 || t.indexOf('Nguyễn Minh Anh') !== -1 && t.indexOf('•') !== -1) {
            p.textContent = newRecord.name + ' • ' + newRecord.phone;
          } else if (t.indexOf('Vincom Đồng Khởi') !== -1 || t.indexOf('Lotte Mart') !== -1 || t.indexOf('Cantavil') !== -1) {
            p.textContent = newRecord.branch;
          } else if (t.indexOf('người lớn') !== -1 || t.indexOf('chỗ ngồi') !== -1) {
            p.textContent = newRecord.adults + ' người lớn, ' + newRecord.kids + ' trẻ em, ' + newRecord.babies + ' trẻ <1m · Tạm tính ' + newRecord.totalEst;
          } else if (t.indexOf('Tổng tạm tính') !== -1) {
            p.textContent = 'Tổng tạm tính: ' + newRecord.totalEst;
          } else if (t.indexOf('tài liệu không nêu') !== -1) {
            p.textContent = 'Đã bao gồm VAT 8% · Vui lòng xuất trình mã QR ' + newCode + ' khi đến quầy Lễ tân.';
          } else if (t.indexOf('Oceania hẹn') !== -1) {
            p.textContent = '“Oceania hẹn ' + newRecord.name + ' lúc ' + newRecord.time + ', ' + newRecord.date + '. Mã vé E-Ticket ' + newCode + '.”';
          } else if ((t.indexOf('Thứ ') !== -1 || t.indexOf('Chủ Nhật') !== -1) && t.indexOf('2026') !== -1) {
            p.textContent = newRecord.date + ' · ' + newRecord.time;
          }
        });
        modalS04.querySelectorAll('.oceania-qr-svg').forEach(function (qrBox) {
          qrBox.innerHTML = app.buildSvgQrCode(newRecord);
        });
        app.openModal('modal-s04');
      }

      app.showToast('Đặt bàn thành công! Mã vé E-Ticket của bạn là ' + newCode);
    }

    [step3Pane, step3ErrorPane].forEach(function (pane) {
      if (!pane) return;
      pane.querySelectorAll('[data-name*="Nút"]').forEach(function (btn) {
        var txt = app.getText(btn);
        if (txt.indexOf('Quay lại') !== -1) {
          btn.setAttribute('data-oceania-handled', '1');
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            switchToStep(2);
          });
        } else if (txt.indexOf('Xác nhận') !== -1 || txt.indexOf('Hoàn tất') !== -1) {
          btn.setAttribute('data-oceania-handled', '1');
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            completeBookingSubmission();
          });
        }
      });
    });


    document.querySelectorAll('.oceania-mobile-view [data-node-id="3375:36988"], .oceania-tablet-view [data-node-id="3504:2456"]').forEach(function (mobBtn) {
      mobBtn.setAttribute('data-oceania-handled', '1');
      mobBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var mName = document.getElementById('mob-booking-name') || document.getElementById('tab-booking-name');
        var mPhone = document.getElementById('mob-booking-phone') || document.getElementById('tab-booking-phone');
        if (mName && document.getElementById('booking-name') && mName.value) {
          document.getElementById('booking-name').value = mName.value;
        }
        if (mPhone && document.getElementById('booking-phone') && mPhone.value) {
          document.getElementById('booking-phone').value = mPhone.value;
        }
        completeBookingSubmission();
      });
    });

    
    var modalS04 = document.getElementById('modal-s04');
    if (modalS04) {
      modalS04.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-name*="Nút"], [data-name*="Action"]');
        if (!btn) return;
        var txt = app.getText(btn);
        if (txt.indexOf('Tra cứu') !== -1 || txt.indexOf('Xem vé') !== -1 || txt.indexOf('Tải') !== -1) {
          e.preventDefault();
          window.location.href = 'booking-lookup.html?code=' + encodeURIComponent(wizardState.code);
        } else if (txt.indexOf('Trang chủ') !== -1 || txt.indexOf('Đóng') !== -1) {
          app.closeModal('modal-s04');
        }
      });
    }

    
    applyBranchSelection(wizardState.branchKey);
    if (params.get('branch') || params.get('date') || params.get('shift')) {
      switchToStep(2);
    }
  {
    


  }
  });
})();
