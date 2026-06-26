export function SiteFooter() {
  return (
    <footer className="border-border bg-surface-secondary mt-12 border-t">
      <div className="text-muted mx-auto max-w-[1200px] px-4 py-8 text-xs">
        <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2">
          {["購物說明", "會員中心", "客服中心", "隱私權政策", "服務條款"].map(
            (item) => (
              <span key={item} className="hover:text-accent">
                {item}
              </span>
            )
          )}
        </div>
        <p className="leading-relaxed">
          本站為 momo 購物網的前端 mock demo，所有商品、價格與活動皆為虛構資料，
          不串接任何真實 API。
        </p>
        <p className="mt-2">© 2026 momo demo. For evaluation purposes only.</p>
      </div>
    </footer>
  );
}
