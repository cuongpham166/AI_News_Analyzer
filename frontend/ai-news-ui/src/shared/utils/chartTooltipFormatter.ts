import type { CallbackDataParams } from 'echarts/types/dist/shared';

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const chartTooltipFormatter = (params: CallbackDataParams) => {
  return `
    <div>
      <div
        style="
          font-size:14px;
          line-height:1.4;
          font-weight:600;
          margin-bottom:8px;
          color:#212529;
        "
      >
        ${capitalize(String(params.name))}
      </div>

      <div
        style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:16px;
          font-size:14px;
          line-height:1.4;
          margin-bottom:4px;
        "
      >
        <span
          style="
            color:#868e96;
            font-weight:400;
          "
        >
          Count
        </span>

        <span
          style="
            color:#212529;
            font-weight:500;
          "
        >
          ${params.value}
        </span>
      </div>

      <div
        style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:16px;
          font-size:14px;
          line-height:1.4;
        "
      >
        <span
          style="
            color:#868e96;
            font-weight:400;
          "
        >
          Share
        </span>

        <span
          style="
            color:#212529;
            font-weight:500;
          "
        >
          ${params.percent}%
        </span>
      </div>
    </div>
  `;
};