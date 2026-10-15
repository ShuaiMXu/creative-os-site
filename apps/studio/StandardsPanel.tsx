import { useState } from "react";
import { Button } from "../../packages/ui";
import { checkStandards } from "../../packages/theme-core/standards";
import type { ThemeStyles } from "../../packages/theme-core";
import type { FoundationApproval } from "../../packages/contracts";
export function StandardsPanel({
  styles,
  foundation,
  onApply,
  onExport,
}: {
  styles: ThemeStyles;
  foundation?: FoundationApproval;
  onApply: () => void;
  onExport: (text: string) => void;
}) {
  const [profile, setProfile] = useState<"general" | "happyhands">(
    "happyhands",
  );
  const checks = checkStandards(styles, profile),
    attention = checks.filter((c) => c.status === "attention").length;
  return (
    <div className="standards-panel">
      <div className="standards-intro">
        <div>
          <h3>主题之外，还要有规则。</h3>
          <p>
            主题变量决定颜色与尺寸。品牌用法、组件状态、页面任务需要独立检查。
          </p>
        </div>
        <label>
          检查基准
          <select
            aria-label="设计检查基准"
            value={profile}
            onChange={(e) => setProfile(e.target.value as typeof profile)}
          >
            <option value="happyhands">HappyHands 设计语言</option>
            <option value="general">通用文字可读性</option>
          </select>
        </label>
      </div>
      <div className="standards-principles">
        <div>
          <span>01</span>
          <h4>品牌与排版</h4>
          <p>
            中性暖灰与细边框，墨色主操作。橙色只用于少量强调；中英文无衬线。
          </p>
        </div>
        <div>
          <span>02</span>
          <h4>组件与状态</h4>
          <p>默认、键盘焦点、加载、禁用、空态与错误都要可读，并提供下一步。</p>
        </div>
        <div>
          <span>03</span>
          <h4>内容与判断</h4>
          <p>
            说明动作结果、失败原因和恢复方式。设计修改进入版本审核，不直接覆盖规范。
          </p>
        </div>
      </div>
      <div className="standards-summary">
        <span>
          {attention ? `${attention} 项需要关注` : "已执行的自动检查未发现偏离"}{" "}
          · {checks.length} 项局部检查
        </span>
        <div className="toolbar">
          {profile === "happyhands" && (
            <Button onClick={onApply}>应用 HappyHands 主题（可撤销）</Button>
          )}
          <Button
            onClick={() =>
              onExport(
                JSON.stringify(
                  {
                    schemaVersion: "0.1",
                    profile,
                    checks,
                    manualReview: "pending",
                    styles,
                  },
                  null,
                  2,
                ),
              )
            }
          >
            导出检查记录
          </Button>
        </div>
      </div>
      <div className="standards-results">
        {checks.map((check) => (
          <article key={check.id} data-status={check.status}>
            <div>
              <strong>
                {check.mode === "light" ? "浅色" : "深色"} · {check.label}
              </strong>
              <span>
                {check.status === "pass"
                  ? "通过"
                  : check.status === "manual"
                    ? "人工检查"
                    : "需关注"}
              </span>
            </div>
            <p>{check.detail}</p>
            <small>依据：{check.source}</small>
          </article>
        ))}
      </div>
      <div className="manual-review">
        <h3>还需要人工确认</h3>
        <p>
          标志是否正确、橙色使用面积、页面是否有多个主操作、真实任务是否顺畅，不能由
          token 数值推断。这些结果仍未验证，也不会生成 Experience Score。
        </p>
        <p>
          {foundation
            ? `已载入 Foundation ${foundation.foundationVersion}：${foundation.foundation.brand.principles.length} 条品牌原则、${foundation.foundation.components.length} 个组件规范。原记录保留在批准流程中。`
            : "还没有导入项目品牌与组件规范。请在「审核变更」中载入现有 Foundation，避免只凭主题预设替代完整设计系统。"}
        </p>
      </div>
    </div>
  );
}
