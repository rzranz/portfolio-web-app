const sa = {
  email: "randizakariaputra22@gmail.com",
  stats: [
    ["Active since", "2022"],
    ["Projects", "14+"],
    ["Partners & clients", "6+"],
  ],
  services: [
    [
      "Backend & APIs",
      [
        "Laravel, Go & Spring Boot",
        "High-concurrency REST APIs",
        "Payment & WhatsApp automation",
      ],
    ],
    [
      "Fullstack Web",
      [
        "Vue 3, Nuxt, React & Next.js",
        "Responsive Tailwind UI",
        "Clean architecture & state",
      ],
    ],
    [
      "Database & Cloud",
      [
        "PostgreSQL, MySQL & SQLite WAL",
        "Docker & CI/CD pipelines",
        "Query & latency tuning",
      ],
    ],
    [
      "IoT & WebGIS",
      [
        "PostGIS & OpenLayers mapping",
        "Real-time sensor telemetry",
        "Automated pump interlocks",
      ],
    ],
    [
      "AI, AR & 3D",
      [
        "Unity 3D & MediaPipe AI",
        "Contextual AI Mentor engines",
        "Interactive Three.js scenes",
      ],
    ],
  ],
  projects: window.PROJECTS || [],
};
window.JB = sa;
(function () {
  var b = window.JB,
    v = document,
    C = v.documentElement,
    l = function (e, n) {
      return (n || v).querySelector(e);
    },
    m = function (e, n) {
      return Array.prototype.slice.call((n || v).querySelectorAll(e));
    };
  function L(e, n) {
    return e.indexOf("/upload/") < 0
      ? e
      : e.replace("/upload/", "/upload/f_auto,q_auto,c_limit,w_" + n + "/");
  }
  function G(e) {
    return [600, 900, 1200, 1600, 1900]
      .map(function (n) {
        return L(e, n) + " " + n + "w";
      })
      .join(", ");
  }
  var pe = b.services.map(function (e, n) {
    return { i: n, n: e[0], items: e[1] };
  });
  pe = pe
    .filter(function (e) {
      return e.n !== "Packaging and Environments";
    })
    .map(function (e, n) {
      return ((e.i = n), e);
    });
  var He = [
    [-0.28, -0.2, 0.1, -0.15, -0.34],
    [0.28, -0.14, 0.1, 0.15, -0.16],
    [-0.24, 0.12, 0.1, 0, 0.02],
    [0.24, 0.28, 0.1, -0.15, 0.2],
    [0, 0, 0.1, 0.12, 0.38],
  ];
  l(".svc-st").insertAdjacentHTML(
    "beforeend",
    pe
      .map(function (e, n) {
        var a = He[n];
        return (
          '<div class="el" data-abs="1" data-p="' +
          a[0] +
          "," +
          a[1] +
          '" data-mp="' +
          a[3] +
          "," +
          a[4] +
          '" data-z="' +
          a[2] +
          '" data-f="0,0"><p class="d svc-nm">' +
          e.n +
          "</p></div>"
        );
      })
      .join("") +
      (function () {
        var e = "",
          n = 7;
        function a() {
          return ((n = (n * 16807) % 2147483647), n / 2147483647);
        }
        for (var i = 0; i < 34; i++) {
          var t = (a() - 0.5) * 1.3,
            r = (a() - 0.5) * 1.05,
            d = -0.3 + a() * 1.9,
            o = 3 + Math.round(a() * 4);
          e +=
            '<div class="el" data-abs="1" data-p="' +
            t.toFixed(3) +
            "," +
            r.toFixed(3) +
            '" data-mp="' +
            (t * 0.8).toFixed(3) +
            "," +
            r.toFixed(3) +
            '" data-z="' +
            d.toFixed(2) +
            '" data-f="0,0" aria-hidden="true"><i class="star" style="width:' +
            o +
            "px;height:" +
            o +
            'px"></i></div>';
        }
        return e;
      })(),
  );
  var Et = [
      {
        x: -0.22,
        y: -0.02,
        w: "clamp(260px,30vw,560px)",
        ar: "4/3",
        ax: 0.05,
        ay: 0.3,
      },
      {
        x: 0.21,
        y: 0.05,
        w: "clamp(260px,30vw,560px)",
        ar: "4/3",
        ax: -0.02,
        ay: -0.3,
      },
      {
        x: -0.18,
        y: 0,
        w: "clamp(260px,30vw,560px)",
        ar: "4/3",
        ax: 0.26,
        ay: 0.34,
      },
    ],
    U = b.projects;
  function renderWorkDiagram(e) {
    var n = [110, 320, 530];
    return (
      '<svg class="work-svg" viewBox="0 0 640 260" role="img" aria-label="' +
      e.title +
      ' project flow"><path d="M192 130h46m164 0h46" fill="none" stroke="var(--line)" stroke-width="2"/>' +
      n
        .map(function (a, i) {
          return (
            '<rect x="' +
            (a - 82) +
            '" y="91" width="164" height="78" rx="2" fill="var(--bg)" stroke="var(--hair)"/><circle cx="' +
            a +
            '" cy="130" r="4" fill="var(--line)"/><text x="' +
            a +
            '" y="134" text-anchor="middle" fill="var(--ink)">' +
            e.diagram[i] +
            "</text>"
          );
        })
        .join("") +
      "</svg>"
    );
  }
  ((l("#work-stops").outerHTML = U.map(function (e, n) {
    var a = Et[n % Et.length],
      i = a.x < 0 ? 1 : -1;
    return (
      '<section class="st" data-label="Work" data-gap="' +
      (n ? 3 : 2.2) +
      '" data-hold=".38" data-ease=".5" data-a="' +
      a.ax +
      "," +
      a.ay +
      '" data-ma="' +
      0.43 * i +
      ',0.36"><div class="el" data-p="' +
      a.x +
      "," +
      a.y +
      '" data-mp="0,-0.02" data-z="0" data-f="' +
      (a.x < 0 ? -0.25 : 0.25) +
      ',0" data-r="' +
      (a.x < 0 ? 18 : -18) +
      '"><button class="card ' +
      (a.x < 0 ? "l" : "r") +
      '" data-proj="' +
      n +
      '" style="width:' +
      a.w +
      '"><span class="fig work-cover" style="--ar:' +
      a.ar +
      '"><img src="' +
      e.cardImage +
      '" alt="" loading="lazy" decoding="async">' +
      '</span><span class="meta"><span class="mono">' +
      String(n + 1).padStart(2, "0") +
      " / " +
      String(U.length).padStart(2, "0") +
      '</span> <span class="mono">' +
      e.category +
      '</span></span><span class="d ' +
      (n % 2 ? "t2" : "b7") +
      '">' +
      e.title +
      '</span><span class="small work-copy">' +
      e.lines
        .map(function (i) {
          return "<span>" + i + "</span>";
        })
        .join(" ") +
      '</span><span class="mono open">View project<i aria-hidden="true"></i></span></button></div></section>'
    );
  }).join("")),
    m(".split").forEach(function (e) {
      var n = 0;
      ((function a(i) {
        (m("*", i),
          Array.prototype.slice.call(i.childNodes).forEach(function (t) {
            if (t.nodeType === 3) {
              var r = v.createDocumentFragment();
              (t.textContent.split(/(\s+)/).forEach(function (d) {
                if (d) {
                  if (/^\s+$/.test(d)) {
                    r.appendChild(v.createTextNode(" "));
                    return;
                  }
                  var o = v.createElement("span");
                  ((o.className = "w"),
                    d.split("").forEach(function (u) {
                      var s = v.createElement("span");
                      ((s.className = "c"),
                        s.style.setProperty("--i", n++),
                        (s.textContent = u),
                        o.appendChild(s));
                    }),
                    r.appendChild(o));
                }
              }),
                i.replaceChild(r, t));
            } else if (t.nodeType === 1) {
              if (t.classList && t.classList.contains("c")) {
                t.style.setProperty("--i", n++);
                return;
              }
              if (
                t.localName === "svg" ||
                t.namespaceURI === "http://www.w3.org/2000/svg" ||
                t.getAttribute("aria-hidden") === "true"
              ) {
                return;
              }
              a(t);
            }
          }));
      })(e),
        e.setAttribute("aria-label", e.textContent));
    }),
    l("#copy").addEventListener("click", function () {
      var e = this,
        n = b.email;
      function a(t) {
        ((e.textContent = t),
          setTimeout(function () {
            e.textContent = "Copy email";
          }, 1800));
      }
      try {
        navigator.clipboard.writeText(n).then(
          function () {
            a("Copied");
          },
          function () {
            (i(), a("Press Ctrl/Cmd+C"));
          },
        );
      } catch (t) {
        (i(), a("Press Ctrl/Cmd+C"));
      }
      function i() {
        var t = v.createRange();
        t.selectNodeContents(l("#mail"));
        var r = getSelection();
        (r.removeAllRanges(), r.addRange(t));
      }
    }));
  var nt = l("#burger");
  function Re(e) {
    (C.classList.toggle("menu-open", e), nt.setAttribute("aria-expanded", e));
  }
  nt.addEventListener("click", function () {
    Re(!C.classList.contains("menu-open"));
  });
  var V = l("#proj"),
    it = l("#pvx"),
    X = -1,
    Fe = null,
    rt = {
      t: v.title,
      d: (l('meta[name="description"]') || {}).content || "",
    };
  function zt(e) {
    var n = v.querySelector('meta[name="description"]'),
      a = v.querySelector('link[rel="canonical"]');
    if (e < 0) {
      ((v.title = rt.t),
        n && (n.content = rt.d),
        a && (a.href = location.origin + "/"));
      return;
    }
    var i = U[e];
    ((v.title = (i.seoTitle || i.title) + " | Randi"),
      n && i.seoDescription && (n.content = i.seoDescription),
      a && (a.href = location.origin + "/"));
  }
  function je(e, n) {
    var a = new URL(location.href);
    e < 0
      ? a.searchParams.delete("project")
      : a.searchParams.set("project", U[e].slug);
    var i = a.pathname + a.search + a.hash;
    if ((zt(e), location.pathname + location.search + location.hash !== i))
      try {
        history[n ? "pushState" : "replaceState"]({ proj: e }, "", i);
      } catch (i) {}
  }
  function Dt() {
    var e = new URLSearchParams(location.search).get("project"),
      n = -1;
    return (
      e &&
        U.forEach(function (a, i) {
          a.slug === e && (n = i);
        }),
      n
    );
  }
  var ot = "(max-width:760px) 100vw, 58vw";
  function st(e, n) {
    return Promise.all(
      U[e].images.slice(0, 2).map(function (a) {
        var i = new Image();
        return (
          (i.sizes = ot),
          a.indexOf("/upload/") >= 0 && (i.srcset = G(a)),
          (i.src = L(a, 1600)),
          i.decode ? i.decode().catch(function () {}) : Promise.resolve()
        );
      }),
    );
  }
  function Pe(e, n) {
    var a = U[e],
      i = U[(e + 1) % U.length],
      t = a.description
        .split(
          `
`,
        )
        .filter(Boolean)
        .map(function (s) {
          return "<p>" + s + "</p>";
        })
        .join(""),
      r = a.images.map(function (s, f) {
        var srcset =
          s.indexOf("/upload/") >= 0
            ? ' srcset="' + G(s) + '" sizes="' + ot + '"'
            : "";
        return (
          '<figure><img src="' +
          L(s, 1600) +
          '"' +
          srcset +
          ' alt="' +
          (a.imageAlts && a.imageAlts[f]
            ? a.imageAlts[f]
            : a.title + " image " + (f + 1)) +
          '"' +
          (f > 1 ? ' loading="lazy" decoding="async"' : "") +
          "></figure>"
        );
      });
    function d(s, f) {
      var j = s.src || s,
        c = j.replace("/upload/", "/upload/f_auto:video,q_auto,w_900/"),
        w = j
          .replace("/upload/", "/upload/so_1,f_jpg,q_auto,w_900/")
          .replace(/\.mp4$/, ".jpg");
      return (
        '<figure class="pv-vid ' +
        f +
        '"><video src="' +
        c +
        '" poster="' +
        w +
        '" muted loop playsinline autoplay preload="metadata"></video></figure>'
      );
    }
    var o = [];
    (a.videos || [])
      .slice()
      .reverse()
      .forEach(function (s) {
        s.after != null ? r.splice(s.after, 0, d(s, "mid")) : o.unshift(s);
      });
    var u = r.join("");
    u ||
      (u =
        '<figure class="work-detail-diagram">' +
        renderWorkDiagram(a) +
        '<figcaption class="mono">Project flow</figcaption></figure>');
    (o.length &&
      (u +=
        '<div class="pv-vids">' +
        o
          .map(function (s) {
            return d(s, "");
          })
          .join("") +
        "</div>"),
      (V.innerHTML =
        '<div class="pv"><div class="pv-l"><span class="mono">' +
        String(e + 1).padStart(2, "0") +
        " / " +
        String(U.length).padStart(2, "0") +
        '</span><h2 class="d b9">' +
        a.title +
        '</h2><div><span class="mono">Overview</span><div style="margin-top:12px">' +
        t +
        '</div></div><dl class="pv-dl"><dt>Project type</dt><dd>' +
        a.projectType +
        "</dd><dt>Services</dt><dd>" +
        a.services.join(", ") +
        '</dd></dl><a class="pv-link mono" href="' +
        a.url +
        '" target="_blank" rel="noopener noreferrer">' +
        a.cta +
        '</a><button class="pv-next" id="pvn"><span class="mono">Next project</span><span class="d t1">' +
        i.title +
        '</span></button></div><div class="pv-r">' +
        u +
        "</div></div>"),
      (V.scrollTop = 0),
      l("#pvn").addEventListener("click", function () {
        dt((e + 1) % U.length);
      }),
      setTimeout(function () {
        st((e + 1) % U.length);
      }, 1200),
      V.animate &&
        !n &&
        m(".pv-r figure, .pv-l > *", V).forEach(function (s, f) {
          s.animate(
            [
              { opacity: 0, transform: "translateY(40px)" },
              { opacity: 1, transform: "none" },
            ],
            {
              duration: 900,
              delay: 120 + f * 60,
              easing: "cubic-bezier(.2,.8,.2,1)",
              fill: "backwards",
            },
          );
        }));
  }
  function Ne(e, n, a) {
    (a || je(e, !0), (X = e), (Fe = n), Pe(e));
    var i = n.getBoundingClientRect(),
      t = innerWidth,
      r = innerHeight,
      d =
        "inset(" +
        Math.max(0, i.top) +
        "px " +
        Math.max(0, t - i.right) +
        "px " +
        Math.max(0, r - i.bottom) +
        "px " +
        Math.max(0, i.left) +
        "px)";
    (V.classList.add("show"),
      (C.style.overflow = "hidden"),
      V.animate && !De
        ? V.animate([{ clipPath: d }, { clipPath: "inset(0px 0px 0px 0px)" }], {
            duration: 900,
            easing: "cubic-bezier(.7,0,.2,1)",
            fill: "forwards",
          })
        : (V.style.clipPath = "inset(0)"),
      it.focus({ preventScroll: !0 }));
  }
  var ne = l("#wipe"),
    me = l("#wpath"),
    he = l("#wtitle"),
    Tt = l("#wnum"),
    ze = !1;
  function dt(e, n) {
    if (!ne.animate || De) {
      ((X = e), n || je(e, !0), Pe(e));
      return;
    }
    if (!ze) {
      ze = !0;
      var a = U[e],
        i = st(e);
      ((Tt.textContent =
        "Next project · " +
        String(e + 1).padStart(2, "0") +
        " / " +
        String(U.length).padStart(2, "0")),
        (he.innerHTML = a.title
          .split("")
          .map(function (o) {
            return o === " " ? " " : '<span class="c">' + o + "</span>";
          })
          .join("")),
        (ne.style.visibility = "visible"),
        (he.style.fontSize = ""));
      var t = he.scrollWidth,
        r = innerWidth * 0.9;
      (t > r &&
        (he.style.fontSize =
          ((parseFloat(getComputedStyle(he).fontSize) * r) / t).toFixed(1) +
          "px"),
        me.getAnimations &&
          me.getAnimations().forEach(function (o) {
            o.cancel();
          }),
        ne.getAnimations &&
          ne.getAnimations().forEach(function (o) {
            o.cancel();
          }));
      var d = me.getTotalLength();
      ((me.style.strokeDasharray = d),
        (me.style.strokeDashoffset = d),
        me.animate(
          [{ strokeDashoffset: d + "px" }, { strokeDashoffset: "0px" }],
          {
            duration: 1e3,
            delay: 650,
            easing: "cubic-bezier(.6,0,.2,1)",
            fill: "both",
          },
        ),
        (ne.animate(
          [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)" }],
          {
            duration: 650,
            easing: "cubic-bezier(.7,0,.2,1)",
            fill: "forwards",
          },
        ).onfinish = function () {
          (ne.classList.add("on"),
            m(".c", he).forEach(function (u, s) {
              u.animate(
                [
                  { transform: "translateY(110%) rotate(6deg)", opacity: 0 },
                  { transform: "none", opacity: 1 },
                ],
                {
                  duration: 750,
                  delay: 60 + s * 38,
                  easing: "cubic-bezier(.2,.8,.2,1)",
                  fill: "both",
                },
              );
            }),
            setTimeout(function () {
              Promise.race([
                i,
                new Promise(function (u) {
                  setTimeout(u, 2500);
                }),
              ]).then(o);
            }, 1250));
          function o() {
            ((X = e), n || je(e, !0), Pe(e, !0));
            var u = ne.animate(
              [
                { clipPath: "inset(0 0 0% 0)" },
                { clipPath: "inset(0 0 100% 0)" },
              ],
              {
                duration: 750,
                easing: "cubic-bezier(.7,0,.2,1)",
                fill: "forwards",
              },
            );
            u.onfinish = function () {
              ((ne.style.visibility = "hidden"),
                ne.classList.remove("on"),
                (ze = !1));
            };
          }
        }));
    }
  }
  function Ge(e, n) {
    if (!(X < 0)) {
      n || je(-1, !0);
      var a = v.querySelector('[data-proj="' + X + '"]');
      if (a) {
        if (((Fe = a), (C.style.overflow = ""), Oe && W.length)) {
          var i = ve.filter(function (o) {
            return o.el.contains(a);
          })[0];
          if (i) {
            var t = i.st.sHold + 2;
            (scrollTo(0, t), (K = t));
          }
        } else a.scrollIntoView({ block: "center" });
        C.style.overflow = "hidden";
      }
      var r = function () {
        (V.classList.remove("show"),
          (V.innerHTML = ""),
          (C.style.overflow = ""),
          (X = -1),
          Fe && e === !0 && Fe.focus({ preventScroll: !0 }));
      };
      if (V.animate && !De) {
        var d = V.animate(
          [
            { clipPath: "inset(0px 0px 0px 0px)" },
            { clipPath: "inset(50% 50% 50% 50%)" },
          ],
          {
            duration: 700,
            easing: "cubic-bezier(.7,0,.2,1)",
            fill: "forwards",
          },
        );
        d.onfinish = r;
      } else r();
    }
  }
  (it.addEventListener("click", function () {
    Ge(!1);
  }),
    addEventListener("popstate", function () {
      var e = Dt();
      if (e < 0) {
        X >= 0 && Ge(!1, !0);
        return;
      }
      if (X < 0) {
        var n = v.querySelector('[data-proj="' + e + '"]');
        n && Ne(e, n, !0);
      } else X !== e && (ze ? ((X = e), Pe(e, !0)) : dt(e, !0));
    }),
    v.addEventListener("keydown", function (e) {
      e.key === "Escape" && (X >= 0 ? Ge(!0) : Re(!1));
    }),
    v.addEventListener("click", function (e) {
      var n = e.target.closest && e.target.closest("[data-proj]");
      n && Ne(+n.dataset.proj, n);
    }));
  var De = matchMedia("(prefers-reduced-motion: reduce)").matches,
    Oe =
      !De &&
      !!window.requestAnimationFrame &&
      !!v.createElement("canvas").getContext;
  if (
    (v.addEventListener("click", function (e) {
      var n = e.target.closest && e.target.closest("[data-go]");
      if (n) {
        (e.preventDefault(), Re(!1));
        var a = n.dataset.go;
        if (!Oe) {
          var i = l("#" + (a === "assist-ding" ? "assist-ding" : a));
          i && i.scrollIntoView({ behavior: "smooth" });
          return;
        }
        var t = W.filter(function (r) {
          return r.id === a || (a === "assist-ding" && r.dk);
        })[0];
        t && scrollTo(0, t.sHold + (t.dk ? t.holdPx * 0.45 : 2));
      }
    }),
    !Oe)
  )
    return;
  C.classList.add("is3d");
  try {
    "scrollRestoration" in history && (history.scrollRestoration = "manual");
  } catch (e) {}
  (scrollTo(0, 0),
    addEventListener("pageshow", function () {
      scrollTo(0, 0);
    }));
  var Ke = l("#cv"),
    k = Ke.getContext("2d"),
    Bt = l("#spacer"),
    se = l("#assist-ding"),
    Te = l(".panel", se),
    Ct = m(".fly", se),
    Be = l(".dk-in", se),
    q,
    x,
    p,
    Z,
    Me,
    W = [],
    ve = [],
    ae = [],
    ge = [],
    Ce = 0,
    ye = null,
    de = 0,
    K = 0,
    Ae = 0,
    qt = performance.now();
  function le(e, n) {
    return ((e = parseFloat(e)), isNaN(e) ? n : e);
  }
  function Ye(e) {
    var n = (e || "0,0").split(",");
    return [le(n[0], 0), le(n[1], 0)];
  }
  function M(e, n, a) {
    return e < n ? n : e > a ? a : e;
  }
  function E(e) {
    return ((e = M(e, 0, 1)), e * e * e * (e * (e * 6 - 15) + 10));
  }
  var lt = 0,
    Se = null;
  function Wt() {
    return (
      Se ||
        ((Se = v.createElement("div")),
        (Se.style.cssText =
          "position:fixed;left:0;top:0;width:1px;height:100vh;height:100lvh;visibility:hidden;pointer-events:none"),
        v.body.appendChild(Se)),
      Math.max(innerHeight, Se.offsetHeight || 0)
    );
  }
  function $e() {
    var e = de ? M(scrollY / de, 0, 1) : 0;
    ((q = innerWidth),
      (x = Wt()),
      (Z = q < 760),
      (lt = q),
      (p = Z ? 900 : M(q * 0.8, 900, 1400)),
      (Me = Math.min(devicePixelRatio || 1, 2)),
      (Ke.width = q * Me),
      (Ke.height = x * Me),
      k.setTransform(Me, 0, 0, Me, 0, 0),
      m(".el .d").forEach(function (h) {
        if (h.classList.contains("h-name")) return;
        if (getComputedStyle(h).whiteSpace === "nowrap") {
          h.style.fontSize = "";
          var J = h.offsetWidth,
            ee = q * 0.9;
          J > ee &&
            (h.style.fontSize =
              ((parseFloat(getComputedStyle(h).fontSize) * ee) / J).toFixed(1) +
              "px");
        }
      }),
      (W = []),
      (ve = []));
    var n = 0;
    (m(".st").forEach(function (h, J) {
      var ee = le(h.dataset.gap, 3);
      J && (n += ee * p);
      var ue = Ye(Z && h.dataset.ma ? h.dataset.ma : h.dataset.a),
        T = {
          sec: h,
          id: h.id,
          label: h.dataset.label || "",
          z: n,
          gap: ee,
          hold: le(h.dataset.hold, 0.6),
          ease: le(h.dataset.ease, 1),
          ax: ue[0],
          ay: ue[1],
          dk: !!h.dataset.dk,
          end: !!h.dataset.end,
          nodes: m(".node", h),
        };
      (W.push(T),
        m(".el", h).forEach(function (B) {
          var ie = Ye(Z && B.dataset.mp ? B.dataset.mp : B.dataset.p),
            re = Ye(B.dataset.f),
            oe = le(B.dataset.z, 0),
            caption = B.querySelector(".h-cap");
          ((B.style.visibility = "hidden"),
            ve.push({
              abs: le(B.dataset.abs, 0),
              captionWidth: caption ? caption.offsetWidth : 0,
              el: B,
              st: T,
              x: ie[0],
              y: ie[1],
              zo: oe,
              z: n + oe * p,
              ff: Math.min(1.7, Math.max(1, T.gap * 0.82)) * p,
              fx: Z ? re[0] * 0.5 : re[0],
              fy: re[1],
              r: Z ? 0 : le(B.dataset.r, 0),
              vis: !1,
              node: B.querySelector(".node"),
            }),
            B.classList.toggle("far", oe > 0.2));
        }),
        T.dk && (ye = T));
    }),
      (ae = []));
    var a = 0,
      i = Z ? 0.52 : 0.46;
    (W.forEach(function (h, J) {
      var ee = h.z - p;
      J && (a += h.gap * i * x);
      var ue = h.dk || J === 0 ? 0 : 0.11,
        T = h.dk ? h.hold * x : h.hold * x * 0.55;
      (ae.push({ s: a, zc: ee - ue * p, ease: J ? h.ease * 0.45 : 0 }),
        (h.sHold = a),
        (h.holdPx = T),
        (a += T),
        ae.push({
          s: a,
          zc: ee + (h.dk ? 0 : J === 0 ? 0.18 : 0.11) * p,
          ease: 0,
        }));
    }),
      (de = a),
      (Bt.style.height = de + x + "px"));
    for (
      var t = [{ z: W[0].z, x: W[0].ax * q, y: W[0].ay * x }], r = 1, d = 1;
      d < W.length;
      d++
    ) {
      var o = W[d - 1],
        u = W[d];
      (u.gap >= 2.2 &&
        ((r = -r),
        t.push({
          z: o.z + (u.z - o.z) * 0.5,
          x: r * (d === 1 ? 0.65 : Z ? 0.85 : 1.05) * q,
          y: (r > 0 ? -0.42 : 0.46) * x,
        })),
        t.push({ z: u.z, x: u.ax * q, y: u.ay * x }));
    }
    ((Ce = t[t.length - 1].z), (ge = []));
    for (var s = t.length, f = [], j = [], c = 0; c < s; c++) {
      var w = t[Math.max(0, c - 1)],
        A = t[Math.min(s - 1, c + 1)],
        _ = Math.max(1, A.z - w.z);
      ((f[c] = c === 0 || c === s - 1 ? 0 : (A.x - w.x) / _),
        (j[c] = c === 0 || c === s - 1 ? 0 : (A.y - w.y) / _));
    }
    for (var c = 0; c < s - 1; c++)
      for (
        var g = t[c],
          H = t[c + 1],
          S = Math.max(1, H.z - g.z),
          P = Math.max(24, Math.round((S / p) * 40)),
          z = 0;
        z < P;
        z++
      ) {
        var I = z / P,
          D = I * I,
          F = D * I,
          y = 2 * F - 3 * D + 1,
          N = F - 2 * D + I,
          Q = -2 * F + 3 * D,
          Y = F - D;
        ge.push({
          z: g.z + S * I,
          x: y * g.x + N * S * f[c] + Q * H.x + Y * S * f[c + 1],
          y: y * g.y + N * S * j[c] + Q * H.y + Y * S * j[c + 1],
        });
      }
    if ((ge.push({ z: Ce, x: t[t.length - 1].x, y: t[t.length - 1].y }), Be)) {
      Be.style.transform = "";
      var R = Be.offsetHeight,
        $ = x - (Z ? 126 : 160);
      Be.style.transform = R > $ ? "scale(" + ($ / R).toFixed(3) + ")" : "";
    }
    ((K = e * de), e > 0 && X < 0 && scrollTo(0, K));
  }
  function Ht(e) {
    if (e <= ae[0].s) return ae[0].zc;
    for (var n = 1; n < ae.length; n++) {
      var a = ae[n - 1],
        i = ae[n];
      if (e <= i.s) {
        var t = (e - a.s) / Math.max(1, i.s - a.s),
          r = i.ease;
        return ((t = t * (1 - r) + E(t) * r), a.zc + (i.zc - a.zc) * t);
      }
    }
    return ae[ae.length - 1].zc;
  }
  function Je(e, n, a) {
    return (
      "rgb(" +
      Math.round(e[0] + (n[0] - e[0]) * a) +
      "," +
      Math.round(e[1] + (n[1] - e[1]) * a) +
      "," +
      Math.round(e[2] + (n[2] - e[2]) * a) +
      ")"
    );
  }
  var ct = [198, 47, 40],
    ut = [198, 47, 40];
  function It(e) {
    k.clearRect(0, 0, q, x);
    var n = q / 2,
      a = x / 2,
      i = 0.1 * p,
      t = Math.min(e + Ae, Ce);
    for (var mirror = 0; mirror < 2; mirror++) {
      k.save();
      if (mirror) {
        k.translate(q, 0);
        k.scale(-1, 1);
      }
      var r = null,
        d = null;
      ((k.lineCap = "butt"),
        (k.lineJoin = "round"),
        (k.miterLimit = 1),
        (k.strokeStyle = Je(ct, ut, ce)));
      for (var o = null, u = 0; u < ge.length; u++) {
        var s = ge[u];
        if (s.z < e + i) {
          r = null;
          continue;
        }
        if (s.z > t)
          if (r) {
            var f = ge[u - 1],
              j = (t - f.z) / Math.max(1, s.z - f.z);
            s = { z: t, x: f.x + (s.x - f.x) * j, y: f.y + (s.y - f.y) * j };
          } else break;
        var c = s.z - e,
          w = p / c,
          A = n + s.x * w,
          _ = a + s.y * w,
          g = { X: A, Y: _, dz: c, z: s.z };
        if (!(r && s.z < t && Math.abs(A - r.X) + Math.abs(_ - r.Y) < 1.2)) {
          if (r) {
            var H = M(2.4 * w, 0.5, 7),
              S =
                (1 - 0.82 * E((c - 1.2 * p) / (Ae - 1.2 * p))) *
                E((c - i) / (0.3 * p)),
              P = Math.round(S * 40) / 40,
              z = Math.round(H * 4) / 4;
            if (P <= 0) {
              (o && (k.stroke(), (o = null)), (r = g));
              continue;
            }
            ((!o || o.a !== P || o.w !== z) &&
              (o && k.stroke(),
              (o = { a: P, w: z }),
              (k.globalAlpha = P),
              (k.lineWidth = z),
              k.beginPath(),
              k.moveTo(r.X, r.Y)),
              k.lineTo(A, _));
          } else o && (k.stroke(), (o = null));
          if (((r = g), (d = g), s.z >= t)) break;
        }
      }
      if ((o && k.stroke(), (k.globalAlpha = 1), d)) {
        var I = p / d.dz,
          D = M(5 * I, 2.5, 14),
          F = t >= Ce - 1;
        ((k.fillStyle = Je(ct, ut, ce)),
          k.beginPath(),
          k.arc(d.X, d.Y, F ? M(11 * I, 6, 22) : D, 0, Math.PI * 2),
          k.fill(),
          F ||
            ((k.globalAlpha = 0.18),
            k.beginPath(),
            k.arc(d.X, d.Y, D * 2.6, 0, Math.PI * 2),
            k.fill(),
            (k.globalAlpha = 1)));
      }
      k.restore();
    }
  }
  var heroScale = null,
    heroScalePending = !1;
  function Rt(e) {
    heroScalePending = !1;
    for (var n = q / 2, a = x / 2, i = 0; i < ve.length; i++) {
      var t = ve[i],
        r = t.z - e,
        d = p * (1 + t.zo),
        o = r - d;
      const isHero = t.el.classList.contains("hero-scene");
      const isFixedHeroCaption = t.el.classList.contains("hero-caption-scene");
      if (o > 2.7 * p || r < 0.16 * p) {
        t.vis && ((t.el.style.visibility = "hidden"), (t.vis = !1));
        continue;
      }
      const rawScale = (t.abs ? p * t.abs : d) / r;
      const heroProgress = Math.max(0, Math.min(1, (rawScale - 1) / 1.43));
      const heroScaleTarget =
        rawScale < 1
          ? rawScale
          : 1 + 1.43 * (1 - Math.pow(1 - heroProgress, 2));
      if (isHero) {
        if (heroScale === null) heroScale = heroScaleTarget;
        const scaleDelta = heroScaleTarget - heroScale;
        heroScale += Math.max(-0.06, Math.min(0.06, scaleDelta));
        heroScalePending = Math.abs(scaleDelta) > 0.06;
      }
      var u = isHero ? heroScale : rawScale,
        s = o > 0 ? E(o / (1.9 * p)) : 0,
        f = (t.x + t.fx * s) * q,
        j = (t.y + t.fy * s) * x,
        c = n + f * u,
        w = a + j * u,
        A = t.ff,
        _ =
          o > 0
            ? 1 - E((o - 0.45 * A) / (0.55 * A))
            : 1 - E((-o - 0.22 * p) / (0.42 * p));
      if (_ < 0.01 && !isHero) {
        t.vis && ((t.el.style.visibility = "hidden"), (t.vis = !1));
        continue;
      }
      const captionMargin = Math.min(16, q * 0.04);
      const captionHalfWidth = (t.captionWidth * u) / 2;
      const captionOverflow = Math.max(
        0,
        captionHalfWidth + captionMargin - c,
        c + captionHalfWidth + captionMargin - q,
      );
      const captionFade = t.captionWidth && !isFixedHeroCaption
        ? 1 - E(captionOverflow / captionMargin)
        : 1;
      const heroFade = isHero ? 1 - E((rawScale - 2.43) / (5.8 - 2.43)) : 1;
      const elementOpacity =
        (isHero ? Math.max(_, 0.7) : _) * captionFade * heroFade;
      if (elementOpacity < 0.01 && !isHero) {
        t.vis && ((t.el.style.visibility = "hidden"), (t.vis = !1));
        continue;
      }
      (t.vis || ((t.el.style.visibility = "visible"), (t.vis = !0)),
        (t.el.style.opacity = elementOpacity.toFixed(3)),
        (t.el.style.transform =
          "translate3d(" +
          c.toFixed(1) +
          "px," +
          w.toFixed(1) +
          "px,0) translate(-50%,-50%) perspective(1100px) rotateY(" +
          (t.r * s).toFixed(2) +
          "deg) scale(" +
          u.toFixed(4) +
          ")"),
        t.el.style.setProperty("--k", s.toFixed(3)),
        t.el.style.setProperty(
          "--fp",
          M((0.55 * p - o) / (0.65 * p), 0, 1).toFixed(3),
        ),
        t.el.style.setProperty(
          "--dp",
          E((-o - 0.03 * p) / (0.38 * p)).toFixed(3),
        ));
      var g = Math.max(0, (-o - 0.03 * p) / (0.38 * p)),
        H =
          g < 1
            ? 3 * g * g - 2 * g * g * g + 0.35 * (g * g * g - g * g)
            : 1 + 0.35 * (g - 1);
      if (
        (t.el.style.setProperty("--sp", H.toFixed(3)),
        t.pose === void 0 &&
          (t.pose = [].slice.call(t.el.querySelectorAll(".pose img"))),
        t.pose.length)
      ) {
        var S = Math.round(
          M((-o + 0.04 * p) / (0.42 * p), 0, 1) * (t.pose.length - 1),
        );
        S !== t.pf &&
          (t.pf != null
            ? t.pose[t.pf].classList.remove("on")
            : t.pose[0].classList.remove("on"),
          t.pose[S].classList.add("on"),
          (t.pf = S));
      }
      if (
        (t.runner === void 0 && (t.runner = t.el.querySelector(".runner")),
        t.runner)
      ) {
        var P = M((0.55 * p - o) / (0.65 * p), 0, 1),
          z = M((-o - 0.1 * p) / (0.42 * p), 0, 1),
          I = P * 96 + z * 26,
          D = -1.5 * z + 2.9 * z * z;
        t.runner.style.left = I.toFixed(2) + "%";
        var F = t.runner.parentNode,
          y = F.offsetWidth;
        t.jw !== y &&
          ((t.jw = y),
          (t.jc = [].slice.call(F.querySelectorAll(".c")).map(function (Y) {
            for (var R = 0, $ = Y; $ && $ !== F;)
              ((R += $.offsetLeft), ($ = $.offsetParent));
            return [Y, (R / y) * 100, (Y.offsetWidth / y) * 100];
          })),
          (t.jx = null));
        var N = Math.min(I, 100);
        (t.jx !== N &&
          ((t.jx = N),
          t.jc.forEach(function (Y) {
            Y[0].style.setProperty(
              "--cf",
              (M((N - Y[1]) / Y[2], 0, 1) * 100).toFixed(1) + "%",
            );
          })),
          (t.runner.style.transform =
            "translate(-50%," +
            D.toFixed(3) +
            "em) rotate(" +
            (z * 24).toFixed(1) +
            "deg)"));
        var Q = z > 0.01 ? "pj" : "run";
        (t.runner._p !== Q &&
          (t.runner.classList.remove("run", "pj"),
          t.runner.classList.add(Q),
          (t.runner._p = Q)),
          Q === "run" &&
            t.runner._ph !== P &&
            ((t.runner._ph = P), ft(t.runner, P * 7 * Math.PI * 2)));
      }
      (t.ctw === void 0 && (t.ctw = t.el.querySelector(".ct-wrap")),
        t.ctw &&
          Kt(
            t.ctw,
            M(
              (K - (t.st.sHold - 0.4 * x)) / (0.4 * x + t.st.holdPx * 0.95),
              0,
              1,
            ),
          ),
        (t.el.style.pointerEvents = _ > 0.6 && u < 1.6 ? "auto" : "none"),
        t.node && t.node.classList.toggle("on", o < 0.05 * p));
    }
  }
  function Nt(e) {
    if (ye) {
      var n = ye.sHold,
        a = ye.holdPx,
        i = E((e - (n - 0.75 * x)) / (1.05 * x)),
        t = (e - (n + 0.05 * x)) / (0.95 * x),
        r = E((e - (n + a - 1.05 * x)) / (1 * x));
      if (i <= 0 || r >= 1) {
        se.style.visibility !== "hidden" &&
          ((se.style.visibility = "hidden"), (se.style.pointerEvents = "none"));
        return;
      }
      se.style.visibility = "visible";
      var d = Math.hypot(q, x) * 0.62 * i + 1;
      Te.style.clipPath =
        "circle(" +
        d.toFixed(1) +
        "px at " +
        (q / 2 + ye.ax * q) +
        "px " +
        (x / 2 + ye.ay * x) +
        "px)";
      var o = 1 - 0.84 * r;
      ((Te.style.transform =
        "perspective(1200px) translate3d(0," +
        -r * x * 0.04 +
        "px,0) rotateX(" +
        r * 14 +
        "deg) scale(" +
        o.toFixed(4) +
        ")"),
        (Te.style.borderRadius = r * 36 + "px"),
        (Te.style.opacity = (1 - E((r - 0.7) / 0.3)).toFixed(3)),
        Ct.forEach(function (s, f) {
          var j = 1 - E(t * 1.6 - f * 0.13);
          s.style.setProperty("--q", j.toFixed(3));
        }),
        (se.style.pointerEvents = i > 0.98 && r < 0.2 ? "auto" : "none"));
    }
  }
  var qe = l("#count"),
    We = !1,
    ce = 0,
    pt = -1,
    Ue = 0;
  qe && (qe.textContent = "0");
  var Ve = {
    bg: [
      [15, 55, 43],
      [10, 10, 10],
    ],
    ink: [
      [239, 231, 218],
      [239, 231, 218],
    ],
    muted: [
      [204, 197, 183],
      [154, 160, 156],
    ],
    hair: [
      [79, 105, 94],
      [44, 47, 45],
    ],
    line: [
      [198, 47, 40],
      [198, 47, 40],
    ],
  };
  function Gt(e) {
    var n = W.filter(function (o) {
      return o.sec.dataset.dark;
    });
    if (n.length) {
      ((ce = 0),
        n.forEach(function (o) {
          var u = o.z - e - p;
          ce = Math.max(
            ce,
            Math.min(
              1 - E((u - 0.45 * p) / (0.85 * p)),
              1 - E((-u - 0.6 * p) / (0.65 * p)),
            ),
          );
        }));
      var a = n[0],
        i = a.z - e - p;
      if (Math.abs(ce - pt) > 0.003) {
        pt = ce;
        for (var t in Ve)
          C.style.setProperty("--" + t, Je(Ve[t][0], Ve[t][1], ce));
      }
      if (!We && i < 0.5 * p && i > -0.8 * p) {
        We = !0;
        var r = performance.now(),
          d = ++Ue;
        (function o(u) {
          if (d === Ue) {
            var s = M((u - r) / 1100, 0, 1),
              f = 1 - Math.pow(1 - s, 3);
            ((qe.textContent = Math.round(14 * f)),
              s < 1 && requestAnimationFrame(o));
          }
        })(r);
      }
      We && i > 1.4 * p && ((We = !1), Ue++, (qe.textContent = "0"));
    }
  }
  function Kt(e, n) {
    if (e._p === n) return;
    ((e._p = n),
      e._k ||
        (e._k = {
          h: e.querySelector("h2"),
          pa: e.querySelector(".para"),
          cs: [].slice.call(e.querySelectorAll(".c")),
        }));
    var a = e._k,
      i = e.offsetWidth,
      t = parseFloat(getComputedStyle(a.h).fontSize);
    a.sig !== i + "|" + t &&
      ((a.sig = i + "|" + t),
      (a.home = a.cs.map(function (te) {
        for (var Mt = 0, At = 0, xe = te; xe && xe !== e;)
          ((Mt += xe.offsetLeft), (At += xe.offsetTop), (xe = xe.offsetParent));
        return [Mt + te.offsetWidth / 2, At + te.offsetHeight / 2];
      })),
      (a.sw = Math.max(0.8 * t, 52)),
      (a.pa.style.width = a.sw + "px"));
    var r = e.getBoundingClientRect(),
      d = r.width / Math.max(1, i),
      o = -r.left / d,
      u = (innerWidth - r.left) / d;
    -r.top / d;
    var s = a.cs.length,
      f = a.sw / 60,
      j = a.home[0][1] - 0.35 * t,
      c = 0.15 * t,
      w = 0.3,
      A = 0.18 * t,
      _ = 0.04,
      g = 0.9,
      H = o - a.sw,
      S = u + a.sw;
    function P(te) {
      return H + (S - H) * M((te - _) / (g - _), 0, 1);
    }
    function z(te) {
      return _ + ((g - _) * (te - H)) / (S - H);
    }
    var I = P(n),
      D = 0.07,
      F = 0,
      y,
      N = a.home.map(function (te) {
        return z(te[0] - 0.04 * t);
      });
    for (y = 0; y < s; y++) n < N[y] && F++;
    var Q = 1 - E(M((n - _) / 0.25, 0, 1)),
      Y = function (te) {
        return te * c + 0.12 * t;
      },
      R = 0;
    for (y = 0; y < s; y++) {
      var $ = M((n - N[y] + 0.02) / 0.06, 0, 1);
      R += 1 - $;
    }
    var h = j - A - Y(R) - Q * ((innerHeight * 0.6) / d),
      J = Math.sin(n * 22);
    n >= g - 0.12 && (h -= E((n - (g - 0.12)) / 0.12) * t * 0.8);
    var ee = 0;
    for (y = 0; y < s; y++) {
      var ue = a.cs[y],
        T = a.home[y],
        B,
        ie,
        re,
        oe;
      if (n < N[y]) {
        var Xe = F - 1 - ee;
        (ee++,
          (B = I + (y % 2 ? 1 : -1) * 0.035 * t + J * 0.02 * t * (Xe / s)),
          (ie = h + 0.06 * t + (F - 1 - (F - 1 - Xe)) * 0 + Xe * c + c * 0.5),
          (re = w),
          (oe = ((y % 3) - 1) * 6 + J * 2));
      } else {
        var be = M((n - N[y]) / D, 0, 1),
          kt = P(N[y]) + (y % 2 ? 1 : -1) * 0.035 * t,
          Ze = h + 0.06 * t + c * (F + 0.5),
          Xt = be * be;
        if (
          ((B = kt + (T[0] - kt) * E(be)),
          (ie = Ze + (T[1] - Ze) * Xt),
          (re = w + (1 - w) * E(Math.min(1, be * 1.6))),
          (oe = ((y % 3) - 1) * 6 * (1 - be)),
          be >= 1)
        ) {
          var Zt = M((n - N[y] - D) / 0.03, 0, 1);
          ie -= Math.sin(Math.PI * Zt) * 0.05 * t;
        }
        Ze = 0;
      }
      var jt =
        (B - T[0]).toFixed(1) +
        "," +
        (ie - T[1]).toFixed(1) +
        "," +
        re.toFixed(3) +
        "," +
        oe.toFixed(1);
      ue._t !== jt &&
        ((ue._t = jt),
        (ue.style.transform =
          Math.abs(B - T[0]) < 0.05 &&
          Math.abs(ie - T[1]) < 0.05 &&
          re > 0.999 &&
          Math.abs(oe) < 0.05
            ? "none"
            : "translate(" +
              (B - T[0]).toFixed(1) +
              "px," +
              (ie - T[1]).toFixed(1) +
              "px) rotate(" +
              oe.toFixed(1) +
              "deg) scale(" +
              re.toFixed(3) +
              ")"));
    }
    ((a.pa.style.visibility = n > _ && n < g ? "visible" : "hidden"),
      (a.pa.style.transform =
        "translate(" +
        (I - 30 * f).toFixed(1) +
        "px," +
        (h - 74 * f).toFixed(1) +
        "px) rotate(" +
        (J * 5).toFixed(2) +
        "deg)"));
  }
  function ft(e, n) {
    e._k ||
      ((e._k = {}),
      m("[data-k]", e).forEach(function (c) {
        e._k[c.dataset.k] = c;
      }));
    var a = e._k,
      i = Math.PI / 180,
      t = Math.abs(Math.sin(n)) * 1.1,
      r = 17,
      d = 25.5 - t,
      o = 19.6,
      u = 14.2 - t;
    function s(c, w) {
      return [Math.sin(c * i) * w, Math.cos(c * i) * w];
    }
    function f(c) {
      var w = 40 * Math.sin(c),
        A =
          12 +
          78 * Math.max(0, Math.cos(c)) * Math.max(0, Math.cos(c) * 0.6 + 0.5),
        _ = s(w, 8.6),
        g = s(w - A, 8.8);
      return (
        "M" +
        r +
        " " +
        d +
        "l" +
        _[0].toFixed(2) +
        " " +
        _[1].toFixed(2) +
        "l" +
        g[0].toFixed(2) +
        " " +
        g[1].toFixed(2)
      );
    }
    function j(c) {
      var w = -52 * Math.sin(c) + 4,
        A = s(w, 6.4),
        _ = s(w + 78, 5.6);
      return (
        "M" +
        o +
        " " +
        u +
        "l" +
        A[0].toFixed(2) +
        " " +
        A[1].toFixed(2) +
        "l" +
        _[0].toFixed(2) +
        " " +
        _[1].toFixed(2)
      );
    }
    (a.lf.setAttribute("d", f(n)),
      a.lb.setAttribute("d", f(n + Math.PI)),
      a.af.setAttribute("d", j(n + Math.PI)),
      a.ab.setAttribute("d", j(n)),
      a.tor.setAttribute(
        "d",
        "M" + r + " " + d + "L" + (o + 0.4) + " " + (u - 1.2),
      ),
      a.hd.setAttribute("cx", 21.4),
      a.hd.setAttribute("cy", (6.4 - t).toFixed(2)));
  }
  m(".runner").forEach(function (e) {
    ft(e, 0);
  });
  var Yt = l("#hudn"),
    $t = l("#hudl"),
    Jt = l("#hud"),
    mt = l("#ticks"),
    ht = "",
    vt = "";
  function Ut(e) {
    var n = W[0],
      a = 0,
      i = 0;
    (W.forEach(function (d) {
      (d.gap >= 2.2 || d === W[0]) &&
        (e >= d.sHold - 0.6 * x && ((n = d), (a = i)), i++);
    }),
      n.label !== ht &&
        ((ht = n.label),
        ($t.textContent = n.label),
        (Yt.textContent = String(a + 1).padStart(2, "0"))));
    var t = M(e / de, 0, 1);
    Jt.style.setProperty("--p", t.toFixed(4));
    var r = de + "|" + x;
    (r !== vt &&
      ((vt = r),
      (mt.innerHTML = W.filter(function (d, o) {
        return o === 0 || d.gap >= 2.2;
      })
        .map(function (d) {
          return (
            '<i class="tk" data-s="' +
            d.sHold +
            '" style="top:' +
            ((d.sHold / de) * 100).toFixed(2) +
            '%"></i>'
          );
        })
        .join(""))),
      m(".tk", mt).forEach(function (d) {
        d.classList.toggle("on", +d.dataset.s <= e + 2);
      }));
  }
  var gt = performance.now(),
    yt = null,
    bt = null,
    xt = -1,
    Le = !0;
  function wt(e) {
    var n = Math.min(0.05, (e - gt) / 1e3);
    gt = e;
    var a = scrollY,
      i = a - K;
    ((K += i * (1 - Math.exp(-n * 3.5))),
      Math.abs(i) < 0.3 && (K = a));
    var t = M((e - qt - 250) / 1700, 0, 1);
    Ae = (Z ? 3 : 3.3) * p * E(t);
    var r = Ht(K);
    ((r !== yt || K !== bt || Ae !== xt || Le || heroScalePending) &&
      ((yt = r),
      (bt = K),
      (xt = Ae),
      (Le = !1),
      Gt(r),
      It(r),
      Rt(r),
      Nt(K),
      Ut(K)),
      requestAnimationFrame(wt));
  }
  var Vt = matchMedia("(pointer: coarse)").matches,
    _t;
  (addEventListener("resize", function () {
    (Vt && innerWidth === lt) ||
      (clearTimeout(_t),
      (_t = setTimeout(function () {
        ($e(), (Le = !0));
      }, 150)));
  }),
    $e(),
    scrollTo(0, 0),
    requestAnimationFrame(wt),
    (function () {
      var n = Dt(),
        e = new URLSearchParams(location.search);
      if (e.has("project")) {
        if (n < 0) {
          je(-1);
          return;
        }
        setTimeout(function () {
          var a = v.querySelector('[data-proj="' + n + '"]');
          if (a) {
            var i = ve.filter(function (r) {
              return r.el.contains(a);
            })[0];
            if (i) {
              var t = i.st.sHold + 2;
              (scrollTo(0, t), (K = t), (Le = !0));
            }
            Ne(n, a, !0);
          }
        }, 700);
      }
    })(),
    v.fonts &&
      v.fonts.ready &&
      v.fonts.ready.then(function () {
        ($e(), (Le = !0));
      }));
})();
