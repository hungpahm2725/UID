/**
 * OCEANIA SEAFOOD & BBQ BUFFET — E-TICKET LOOKUP & MANAGEMENT ENGINE (lookup.js)
 * ------------------------------------------------------------------------------
 * Implements all interactive E-Ticket features on booking-lookup.html:
 *  1. Search bookings in localStorage by Booking Code (OCN-XXXXXX) or 10-digit Phone Number
 *     (with OTP verification modal S05 for phone search, and Not Found pane S06).
 *  2. Render Royal Serrated E-Ticket (oceania-eticket-serrated) with live SVG QR code
 *     and clickable Recent Bookings quick-chips (#oceania-recent-bookings-bar).
 *  3. Enforce the >= 2 Hours vs < 2 Hours Reschedule Lock Rule:
 *     - Checks time difference until reservation (or #oceania-test-lock-2h toggle).
 *     - If < 2 hours: Displays #oceania-lock-2h-banner AND switches to native Figma S25 pane
 *       (#lookup-pane-under2h) blocking online reschedule and directing the guest to Hotline 1900 888 999.
 *     - If >= 2 hours: Opens Reschedule Pane (S07) to update date/time/guests in localStorage -> S24.
 *  4. Cancel Reservation (S08 -> S09):
 *     - Reads cancellation reason from #cancel-reason-select, marks booking status as 'ĐÃ HỦY'
 *       in crimson red, disables QR code, and saves to localStorage.
 *  5. Download E-Ticket PDF / PNG (S10):
 *     - Integrates html2canvas and jsPDF to export high-resolution PDF ('Tải vé PDF')
 *       or PNG ('Lưu ảnh (.PNG)') directly to the user's device.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var defaultPane = document.getElementById('lookup-pane-default');
    var updatedPane = document.getElementById('lookup-pane-updated');
    var notfoundPane = document.getElementById('lookup-pane-notfound');
    var reschedulePane = document.getElementById('lookup-pane-reschedule');
    var under2hPane = document.getElementById('lookup-pane-under2h');
    var cancelledPane = document.getElementById('lookup-pane-cancelled');
    if (!defaultPane) return;

    var app = window.OceaniaApp;
    var activeBooking = app.getBookings()[0];
    var pendingPhoneMatch = null;
    var allPanes = [defaultPane, updatedPane, notfoundPane, reschedulePane, under2hPane, cancelledPane];

    function switchLookupPane(paneId) {
      allPanes.forEach(function (p) {
        if (p) p.classList.toggle('active', p.id === paneId);
      });
    }

    /* Render Recent Bookings Quick-Chips Bar */
    function renderRecentBookingsBar() {
      var bar = document.getElementById('oceania-recent-bookings-bar');
      if (!bar) return;
      var list = app.getBookings();
      var html = '<span style="font-size:12px;font-weight:700;color:#07192f;margin-right:4px;">Vé đặt bàn gần đây trong máy của bạn:</span>';
      list.slice(0, 5).forEach(function (b) {
        var isCurrent = activeBooking && activeBooking.code === b.code;
        var statusTag = b.status === 'ĐÃ HỦY' ? ' (ĐÃ HỦY)' : '';
        html +=
          '<button type="button" class="oceania-inline-chip' + (isCurrent ? ' active' : '') + '" data-booking-code="' + b.code + '">' +
          b.code + ' • ' + b.name + statusTag +
          '</button>';
      });
      bar.innerHTML = html;

      bar.querySelectorAll('[data-booking-code]').forEach(function (chip) {
        chip.addEventListener('click', function () {
          var code = chip.getAttribute('data-booking-code');
          var found = app.getBookings().find(function (item) { return item.code === code; });
          if (found) {
            var codeInp = document.getElementById('lookup-code');
            if (codeInp) codeInp.value = found.code;
            loadBookingIntoTicket(found);
            app.showToast('Đang hiển thị vé điện tử E-Ticket: ' + found.code);
          }
        });
      });
    }

    /* Populate E-Ticket DOM with activeBooking data */
    function loadBookingIntoTicket(booking) {
      if (!booking) return;
      activeBooking = booking;

      /* Update QR Code SVG */
      document.querySelectorAll('.oceania-qr-svg').forEach(function (qrEl) {
        if (booking.status === 'ĐÃ HỦY') {
          qrEl.innerHTML =
            '<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fef2f2;border:2px dashed #dc2626;padding:8px;text-align:center;border-radius:6px;">' +
            '<strong style="color:#dc2626;font-size:12px;letter-spacing:1px;">ĐÃ HỦY VÉ</strong>' +
            '<span style="color:#64748b;font-size:10px;margin-top:4px;">Mã QR đã vô hiệu hóa</span>' +
            '</div>';
        } else {
          qrEl.innerHTML = app.buildSvgQrCode(booking);
        }
      });

      /* Update booking code, customer name, branch, date/time & status across panes + Tablet + Mobile */
      allPanes.concat([
        document.getElementById('modal-s10'),
        document.querySelector('.oceania-tablet-view'),
        document.querySelector('.oceania-mobile-view')
      ]).forEach(function (container) {
        if (!container) return;
        container.querySelectorAll('p').forEach(function (p) {
          var t = app.getText(p);
          var role = p.getAttribute('data-oceania-ticket-field');
          if (role === 'code' || /^OCN-/.test(t)) {
            p.setAttribute('data-oceania-ticket-field', 'code');
            p.textContent = booking.code;
          } else if (role === 'guest' || t.indexOf('Nguyễn Minh Khôi') !== -1 || t.indexOf('Nguyễn Minh Anh') !== -1 || t.indexOf('Trần Hoàng Nam') !== -1) {
            p.setAttribute('data-oceania-ticket-field', 'guest');
            p.textContent = booking.name + ' — ' + booking.phone;
          } else if (role === 'branch' || t.indexOf('Vincom Đồng Khởi') !== -1 || t.indexOf('Lotte Mart') !== -1 || t.indexOf('Cantavil') !== -1) {
            p.setAttribute('data-oceania-ticket-field', 'branch');
            p.textContent = booking.branch;
          } else if (role === 'status' || t.indexOf('ĐÃ XÁC NHẬN') !== -1 || t.indexOf('ĐÃ CHECK-IN') !== -1 || t.indexOf('ĐÃ ĐỔI LỊCH') !== -1) {
            p.setAttribute('data-oceania-ticket-field', 'status');
            if (booking.status === 'ĐÃ CHECK-IN (QUÉT QR)') {
              p.textContent = '✓ ĐÃ CHECK-IN QUA QR';
              p.style.color = '#10b981';
            } else if (booking.status === 'ĐÃ HỦY') {
              p.textContent = '✕ ĐÃ HỦY VÉ';
              p.style.color = '#ef4444';
            } else {
              p.textContent = '✓ ' + (booking.status || 'ĐÃ XÁC NHẬN • HIỆU LỰC');
            }
          }
        });
      });

      if (booking.status === 'ĐÃ HỦY') {
        switchLookupPane('lookup-pane-cancelled');
      } else if (booking.status === 'ĐÃ ĐỔI LỊCH HẸN' && updatedPane) {
        switchLookupPane('lookup-pane-updated');
      } else {
        switchLookupPane('lookup-pane-default');
      }
      renderRecentBookingsBar();
    }

    /* Check if reservation is < 2 hours away (or simulated via #oceania-test-lock-2h) */
    function isLockedUnder2Hours(booking) {
      var testLockCheckbox = document.getElementById('oceania-test-lock-2h');
      if (testLockCheckbox && testLockCheckbox.checked) {
        return true;
      }
      if (!booking || !booking.date || !booking.time) return false;
      var dateMatch = booking.date.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      var timeMatch = booking.time.match(/(\d{1,2}):(\d{2})/);
      if (dateMatch && timeMatch) {
        var dt = new Date(
          parseInt(dateMatch[3], 10),
          parseInt(dateMatch[2], 10) - 1,
          parseInt(dateMatch[1], 10),
          parseInt(timeMatch[1], 10),
          parseInt(timeMatch[2], 10)
        );
        var diffHours = (dt.getTime() - Date.now()) / 3600000;
        if (diffHours >= 0 && diffHours < 2) {
          return true;
        }
      }
      return false;
    }

    /* Toggle < 2h lock banner & S25 pane immediately when test checkbox changes */
    var testLockChk = document.getElementById('oceania-test-lock-2h');
    var lockBanner = document.getElementById('oceania-lock-2h-banner');
    if (testLockChk && lockBanner) {
      testLockChk.addEventListener('change', function () {
        lockBanner.style.display = testLockChk.checked ? 'flex' : 'none';
        if (testLockChk.checked) {
          if (under2hPane) switchLookupPane('lookup-pane-under2h');
          app.showToast('Đang bật chế độ mô phỏng: Còn < 2 tiếng trước giờ ăn (Khóa đổi lịch trực tuyến — S25).');
        } else {
          loadBookingIntoTicket(activeBooking);
          app.showToast('Đã tắt mô phỏng < 2 tiếng: Cho phép đổi lịch hẹn trực tuyến (≥ 2 tiếng).');
        }
      });
    }

    /* 1. Search Booking Form Handler */
    function handleLookupSearch(triggerEl) {
      var container = (triggerEl && triggerEl.closest('.oceania-lookup-pane')) || document;
      var codeInp = container.querySelector('input') || document.getElementById('lookup-code');
      var rawVal = codeInp ? codeInp.value.trim() : '';
      var codeVal = rawVal.toUpperCase();
      var phoneClean = rawVal.replace(/\s+/g, '');

      var list = app.getBookings();
      var match = null;

      /* If user typed a 10-digit phone number, find match and open OTP Modal S05 */
      if (/^0\d{9}$/.test(phoneClean)) {
        match = list.find(function (b) {
          return b.phone.replace(/\s+/g, '') === phoneClean;
        });
        if (match) {
          pendingPhoneMatch = match;
          app.openModal('modal-s05');
          return;
        }
      }

      if (codeVal) {
        match = list.find(function (b) {
          return b.code.toUpperCase() === codeVal || codeVal.indexOf(b.code.toUpperCase()) !== -1 || b.phone.replace(/\s+/g, '') === phoneClean;
        });
      }

      if (match) {
        loadBookingIntoTicket(match);
        app.showToast('Đã tìm thấy vé đặt bàn ' + match.code + ' của khách hàng ' + match.name);
      } else {
        switchLookupPane('lookup-pane-notfound');
        app.showToast('Không tìm thấy mã đặt bàn khớp thông tin. Gợi ý: OCN-311026-001 hoặc 0909123456');
      }
    }

    document.querySelectorAll('[data-name="Nút tra cứu"], [data-node-id="3361:12731"], .oceania-mobile-view [data-node-id="3375:37032"], .oceania-tablet-view [data-node-id="3504:2499"], .oceania-tablet-view [data-node-id="3504:2501"], .oceania-mobile-view [data-node-id="3375:37030"]').forEach(function (btn) {
      btn.setAttribute('data-oceania-handled', '1');
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        handleLookupSearch(btn);
      });
    });

    document.querySelectorAll('#lookup-code, [data-oceania-field="lookup-code"]').forEach(function (inp) {
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleLookupSearch(inp);
        }
      });
    });

    /* Lookup Mode Tabs ("Theo mã đặt bàn" / "Theo số điện thoại" on Tablet 3504:2493 & Mobile 3375:37024) */
    document.querySelectorAll('[data-node-id="3504:2493"], [data-node-id="3375:37024"]').forEach(function (modeWrap) {
      var scope = modeWrap.closest('.oceania-tablet-view, .oceania-mobile-view') || document;
      Array.from(modeWrap.children).forEach(function (tab) {
        tab.setAttribute('data-oceania-handled', '1');
        tab.style.cursor = 'pointer';
        tab.addEventListener('click', function () {
          var isPhone = app.getText(tab).toLowerCase().indexOf('điện thoại') !== -1;
          Array.from(modeWrap.children).forEach(function (sib) {
            sib.style.backgroundColor = '#ffffff';
            var sp = sib.querySelector('p');
            if (sp) sp.style.color = '#1e293b';
          });
          tab.style.backgroundColor = '#07192f';
          var pp = tab.querySelector('p');
          if (pp) pp.style.color = '#f8f9fa';
          var inp = scope.querySelector('[data-oceania-field="lookup-code"], input');
          if (inp) {
            inp.placeholder = isPhone ? 'Nhập số điện thoại 10 số (VD: 0909123456)...' : 'Nhập mã đặt bàn (VD: OCN-311026-001)...';
            inp.focus();
          }
          app.showToast(isPhone ? 'Chế độ tra cứu theo Số điện thoại (xác thực OTP).' : 'Chế độ tra cứu theo Mã đặt bàn OCN.');
        });
      });
    });

    /* OTP Modal S05 Verification */
    var modalS05 = document.getElementById('modal-s05');
    if (modalS05) {
      modalS05.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-name*="Nút"], [data-name*="Action"]');
        if (!btn) return;
        var txt = app.getText(btn);
        if (txt.indexOf('Xác nhận') !== -1 || txt.indexOf('Hoàn tất') !== -1) {
          app.closeModal('modal-s05');
          if (pendingPhoneMatch) {
            loadBookingIntoTicket(pendingPhoneMatch);
            app.showToast('Xác thực OTP thành công! Đang hiển thị vé ' + pendingPhoneMatch.code);
          }
        } else if (txt.indexOf('Đóng') !== -1 || txt.indexOf('Hủy') !== -1 || txt.indexOf('Gửi lại') !== -1) {
          if (txt.indexOf('Gửi lại') !== -1) {
            app.showToast('Đã gửi lại mã OTP 6 chữ số qua Zalo & SMS!');
          } else {
            app.closeModal('modal-s05');
          }
        }
      });
    }

    /* Not Found Pane S06 Retry Button */
    if (notfoundPane) {
      notfoundPane.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-name*="Nút"], [data-name*="Action"]');
        if (!btn) return;
        var txt = app.getText(btn);
        if (txt.indexOf('Thử lại') !== -1 || txt.indexOf('Tra cứu') !== -1 || txt.indexOf('Đặt bàn') === -1) {
          e.preventDefault();
          var codeInp = document.getElementById('lookup-code');
          if (codeInp) codeInp.value = 'OCN-311026-001';
          loadBookingIntoTicket(app.getBookings()[0]);
        }
      });
    }

    /* 2. E-Ticket Action Buttons across Default, Updated, Tablet & Mobile Panes */
    [defaultPane, updatedPane, under2hPane, document.querySelector('.oceania-tablet-view'), document.querySelector('.oceania-mobile-view')].forEach(function (pane) {
      if (!pane) return;
      pane.querySelectorAll('[data-name*="Nút"], [data-name*="Action"]').forEach(function (btn) {
        var txt = app.getText(btn);
        if (txt.indexOf('Đổi ngày') !== -1 || txt.indexOf('Đổi lịch') !== -1 || txt.indexOf('Đổi giờ') !== -1) {
          btn.setAttribute('data-oceania-handled', '1');
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            if (isLockedUnder2Hours(activeBooking)) {
              if (lockBanner) {
                lockBanner.style.display = 'flex';
              }
              if (under2hPane) switchLookupPane('lookup-pane-under2h');
              app.showToast('Không thể đổi lịch trực tuyến vì thời gian còn dưới 2 tiếng trước giờ ăn. Vui lòng gọi 1900 888 999.');
              return;
            }
            if (lockBanner) lockBanner.style.display = 'none';
            switchLookupPane('lookup-pane-reschedule');
            app.showToast('Đang mở form đổi lịch hẹn trực tuyến (Trước giờ ăn ≥ 2 tiếng).');
          });
        } else if (txt.indexOf('Hủy đặt bàn') !== -1 || txt.indexOf('Hủy bàn') !== -1 || txt.indexOf('Hủy vé') !== -1) {
          btn.setAttribute('data-oceania-handled', '1');
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            app.openModal('modal-s08');
          });
        } else if (txt.indexOf('Tải vé') !== -1 || txt.indexOf('Lưu ảnh') !== -1 || txt.indexOf('PDF') !== -1 || txt.indexOf('PNG') !== -1) {
          btn.setAttribute('data-oceania-handled', '1');
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            app.openModal('modal-s10');
          });
        }
      });
    });

    /* 3. Reschedule Pane S07: Select new date/time and save to localStorage -> S24 */
    if (reschedulePane) {
      var newTimeSelected = '19:30';
      reschedulePane.querySelectorAll('[data-name*="Ca"], [data-name*="Giờ"], [data-name*="Lựa chọn"], [data-name*="Khung giờ"]').forEach(function (slot) {
        slot.style.cursor = 'pointer';
        slot.addEventListener('click', function () {
          var m = app.getText(slot).match(/(\d{2}:\d{2})/);
          if (m) newTimeSelected = m[1];
          slot.style.borderColor = '#d4af37';
        });
      });

      reschedulePane.querySelectorAll('[data-name*="Nút"], [data-name*="Action"]').forEach(function (btn) {
        var txt = app.getText(btn);
        if (txt.indexOf('Lưu') !== -1 || txt.indexOf('Xác nhận') !== -1) {
          btn.setAttribute('data-oceania-handled', '1');
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            var list = app.getBookings();
            var target = list.find(function (b) { return b.code === activeBooking.code; });
            if (target) {
              target.time = newTimeSelected;
              target.status = 'ĐÃ ĐỔI LỊCH HẸN';
              app.saveBookings(list);
              loadBookingIntoTicket(target);
            } else if (updatedPane) {
              switchLookupPane('lookup-pane-updated');
            } else {
              switchLookupPane('lookup-pane-default');
            }
            app.showToast('Đã cập nhật giờ hẹn mới (' + newTimeSelected + ') cho mã vé ' + activeBooking.code + '!');
          });
        } else if (txt.indexOf('Quay lại') !== -1 || txt.indexOf('Hủy') !== -1) {
          btn.setAttribute('data-oceania-handled', '1');
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            switchLookupPane('lookup-pane-default');
          });
        }
      });
    }

    /* 4. Cancel Booking Modal S08 -> S09 ('ĐÃ HỦY' in Red + Disable QR Code) */
    var modalS08 = document.getElementById('modal-s08');
    if (modalS08) {
      modalS08.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-name*="Nút"], [data-name*="Action"]');
        if (!btn) return;
        var txt = app.getText(btn);
        if (txt.indexOf('Xác nhận hủy') !== -1 || txt.indexOf('Đồng ý') !== -1) {
          var reasonSel = document.getElementById('cancel-reason-select');
          var reason = reasonSel ? reasonSel.value : 'Thay đổi lịch trình cá nhân';
          var list = app.getBookings();
          var target = list.find(function (b) { return b.code === activeBooking.code; });
          if (target) {
            target.status = 'ĐÃ HỦY';
            target.cancelReason = reason;
            app.saveBookings(list);
            activeBooking = target;
          }
          app.closeModal('modal-s08');
          loadBookingIntoTicket(activeBooking);
          app.showToast('Vé ' + activeBooking.code + ' đã chuyển sang trạng thái ĐÃ HỦY. Mã QR đã vô hiệu hóa.');
        } else if (txt.indexOf('Giữ') !== -1 || txt.indexOf('Quay lại') !== -1 || txt.indexOf('Đóng') !== -1) {
          app.closeModal('modal-s08');
        }
      });
    }

    /* 5. Download E-Ticket as PDF or PNG via html2canvas & jsPDF (Modal S10) */
    function exportTicketFile(format) {
      var ticketEl = document.querySelector('#modal-s10 .oceania-modal-card') || document.querySelector('.oceania-eticket-serrated');
      var codeStr = (activeBooking && activeBooking.code) ? activeBooking.code : 'OCN-311026-001';

      if (window.html2canvas && ticketEl) {
        app.showToast('Đang kết xuất vé điện tử ' + codeStr + ' độ phân giải cao...');
        window.html2canvas(ticketEl, { scale: 2, useCORS: true, backgroundColor: '#f8f9fa' }).then(function (canvas) {
          if (format === 'pdf' && window.jspdf && window.jspdf.jsPDF) {
            var jsPDF = window.jspdf.jsPDF;
            var pdf = new jsPDF('p', 'mm', 'a4');
            var imgData = canvas.toDataURL('image/png');
            var pdfWidth = 180;
            var pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 15, 15, pdfWidth, pdfHeight);
            pdf.save('Oceania-ETicket-' + codeStr + '.pdf');
            app.showToast('Đã tải xuống tệp PDF: Oceania-ETicket-' + codeStr + '.pdf');
          } else {
            var link = document.createElement('a');
            link.download = 'Oceania-ETicket-' + codeStr + '.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            app.showToast('Đã lưu ảnh vé E-Ticket: Oceania-ETicket-' + codeStr + '.png');
          }
        });
      } else {
        /* Fallback Canvas generator if offline */
        var c = document.createElement('canvas');
        c.width = 800;
        c.height = 460;
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#07192f';
        ctx.fillRect(0, 0, 800, 460);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 4;
        ctx.strokeRect(16, 16, 768, 428);
        ctx.fillStyle = '#f8f9fa';
        ctx.font = 'bold 28px Georgia';
        ctx.fillText('OCEANIA SEAFOOD & BBQ BUFFET — E-TICKET', 40, 70);
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#d4af37';
        ctx.fillText('MÃ ĐẶT BÀN: ' + codeStr + ' (' + (activeBooking.status || 'ĐÃ XÁC NHẬN') + ')', 40, 120);
        ctx.fillStyle = '#ffffff';
        ctx.font = '18px sans-serif';
        ctx.fillText('Khách hàng: ' + (activeBooking.name || 'Nguyễn Minh Khôi') + ' — SĐT: ' + (activeBooking.phone || '0909123456'), 40, 175);
        ctx.fillText('Chi nhánh: ' + (activeBooking.branch || 'Vincom Đồng Khởi, Quận 1'), 40, 215);
        ctx.fillText('Thời gian: ' + (activeBooking.time || '19:00') + ' | ' + (activeBooking.date || 'Thứ Bảy, 31/10/2026'), 40, 255);
        ctx.fillText('Số khách: ' + (activeBooking.adults || 4) + ' người lớn, ' + (activeBooking.kids || 1) + ' trẻ em', 40, 295);
        var payloadText = app.resolveBookingQrText ? app.resolveBookingQrText(activeBooking) : codeStr;
        var qrMat = app.buildQrMatrix ? app.buildQrMatrix(payloadText) : null;
        if (qrMat) {
          var modSize = Math.floor(170 / qrMat.length);
          var qx0 = 590, qy0 = 135;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(qx0 - 10, qy0 - 10, qrMat.length * modSize + 20, qrMat.length * modSize + 20);
          ctx.fillStyle = '#07192f';
          for (var rr = 0; rr < qrMat.length; rr++) {
            for (var cc = 0; cc < qrMat.length; cc++) {
              if (qrMat[rr][cc]) {
                ctx.fillRect(qx0 + cc * modSize, qy0 + rr * modSize, modSize, modSize);
              }
            }
          }
        }
        var a = document.createElement('a');
        a.download = 'Oceania-ETicket-' + codeStr + '.png';
        a.href = c.toDataURL('image/png');
        a.click();
        app.showToast('Đã lưu vé điện tử Oceania-ETicket-' + codeStr + '.png');
      }
    }

    var modalS10 = document.getElementById('modal-s10');
    if (modalS10) {
      modalS10.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-name*="Nút"], [data-name*="Action"]');
        if (!btn) return;
        var txt = app.getText(btn);
        if (txt.indexOf('PDF') !== -1) {
          exportTicketFile('pdf');
        } else if (txt.indexOf('PNG') !== -1 || txt.indexOf('Lưu ảnh') !== -1) {
          exportTicketFile('png');
        } else if (txt.indexOf('Đóng') !== -1 || txt.indexOf('Quay lại') !== -1) {
          app.closeModal('modal-s10');
        }
      });
    }

    /* Check URL query ?code=OCN-... on initial page load */
    var urlParams = new URLSearchParams(window.location.search);
    var initCode = urlParams.get('code');
    if (initCode) {
      var foundInit = app.getBookings().find(function (b) {
        return b.code.toUpperCase() === initCode.toUpperCase();
      });
      if (foundInit) {
        var cInp = document.getElementById('lookup-code');
        if (cInp) cInp.value = foundInit.code;
        loadBookingIntoTicket(foundInit);
      } else {
        loadBookingIntoTicket(activeBooking);
      }
    } else {
      loadBookingIntoTicket(activeBooking);
    }
  });
})();
