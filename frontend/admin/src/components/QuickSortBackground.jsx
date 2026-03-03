import { useEffect, useRef } from 'react';

/**
 * 快速排序算法可视化背景
 * 使用 Java 代码风格展示排序过程
 */
const QuickSortBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let bars = [];
    let animations = [];
    let currentStep = 0;
    let isSorting = false;

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initBars();
    };

    // 初始化数据条
    const initBars = () => {
      const barCount = 30;
      const maxHeight = canvas.height * 0.4;
      const minHeight = maxHeight * 0.2;
      bars = [];

      for (let i = 0; i < barCount; i++) {
        bars.push({
          value: Math.random() * (maxHeight - minHeight) + minHeight,
          x: (canvas.width / barCount) * i + canvas.width / barCount / 2,
          targetX: (canvas.width / barCount) * i + canvas.width / barCount / 2,
          color: '#6366f1',
          targetColor: '#6366f1',
          pivot: false,
          comparing: false,
          sorted: false,
          label: String(Math.floor(Math.random() * 100))
        });
      }

      // 开始排序动画
      startSortAnimation();
    };

    // 快速排序算法 - 生成动画步骤
    const generateQuickSortAnimations = (arr, low, high) => {
      if (low < high) {
        const pivotIndex = partition(arr, low, high);
        generateQuickSortAnimations(arr, low, pivotIndex - 1);
        generateQuickSortAnimations(arr, pivotIndex + 1, high);
      }
    };

    const partition = (arr, low, high) => {
      const pivot = arr[high];
      let i = low - 1;

      // 标记 pivot
      animations.push({ type: 'pivot', index: high });

      for (let j = low; j < high; j++) {
        // 标记比较
        animations.push({ type: 'compare', indices: [j, high] });

        if (arr[j].value < pivot.value) {
          i++;
          // 交换
          animations.push({ type: 'swap', indices: [i, j] });
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }

      // 最终交换
      animations.push({ type: 'swap', indices: [i + 1, high] });
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

      // 标记已排序
      animations.push({ type: 'sorted', index: i + 1 });

      return i + 1;
    };

    // 开始排序动画
    const startSortAnimation = () => {
      animations = [];
      const arrCopy = [...bars];
      generateQuickSortAnimations(arrCopy, 0, arrCopy.length - 1);
      animations.push({ type: 'allSorted' });
      currentStep = 0;
      isSorting = true;
    };

    // 更新动画
    const updateAnimation = () => {
      if (!isSorting || currentStep >= animations.length) {
        // 重新开始
        setTimeout(() => {
          initBars();
        }, 2000);
        return;
      }

      const anim = animations[currentStep];

      // 重置颜色
      bars.forEach(bar => {
        if (!bar.sorted) {
          bar.targetColor = '#6366f1';
        }
        bar.pivot = false;
        bar.comparing = false;
      });

      switch (anim.type) {
        case 'pivot':
          bars[anim.index].pivot = true;
          bars[anim.index].targetColor = '#f59e0b'; // 橙色 pivot
          break;

        case 'compare':
          bars[anim.indices[0]].comparing = true;
          bars[anim.indices[1]].comparing = true;
          bars[anim.indices[0]].targetColor = '#10b981'; // 绿色比较
          bars[anim.indices[1]].targetColor = '#10b981';
          break;

        case 'swap':
          const [i, j] = anim.indices;
          // 交换位置和值
          const tempX = bars[i].targetX;
          bars[i].targetX = bars[j].targetX;
          bars[j].targetX = tempX;
          bars[i].targetColor = '#f472b6'; // 粉色交换
          bars[j].targetColor = '#f472b6';
          break;

        case 'sorted':
          bars[anim.index].sorted = true;
          bars[anim.index].targetColor = '#10b981'; // 绿色已排序
          break;

        case 'allSorted':
          bars.forEach(bar => {
            bar.sorted = true;
            bar.targetColor = '#10b981';
          });
          break;
      }

      currentStep++;
    };

    // 渲染
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制 Java 代码风格背景
      drawCodeBackground();

      // 更新条形位置
      bars.forEach(bar => {
        // 平滑移动
        bar.x += (bar.targetX - bar.x) * 0.1;

        // 颜色过渡
        if (bar.color !== bar.targetColor) {
          bar.color = bar.targetColor;
        }
      });

      // 绘制条形图
      const barWidth = (canvas.width / bars.length) - 8;
      const maxHeight = canvas.height * 0.35;
      const baseY = canvas.height * 0.75;

      bars.forEach((bar, index) => {
        const height = bar.value;
        const x = bar.x - barWidth / 2;

        // 创建渐变
        const gradient = ctx.createLinearGradient(x, baseY - height, x, baseY);
        gradient.addColorStop(0, bar.color);
        gradient.addColorStop(1, adjustColor(bar.color, -30));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, baseY - height, barWidth, height, 6);
        ctx.fill();

        // 添加发光效果
        if (bar.pivot || bar.comparing) {
          ctx.shadowColor = bar.color;
          ctx.shadowBlur = 20;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // 绘制数值标签
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '12px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(bar.label, bar.x, baseY - height - 10);
      });

      // 绘制分隔线
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      ctx.lineTo(canvas.width, baseY);
      ctx.stroke();

      // 更新动画步骤
      updateAnimation();

      animationFrameId = requestAnimationFrame(render);
    };

    // 绘制代码背景效果
    const drawCodeBackground = () => {
      const time = Date.now() * 0.001;

      // 绘制代码行效果
      ctx.fillStyle = 'rgba(99, 102, 241, 0.03)';
      const lineHeight = 24;
      const startY = canvas.height * 0.15;

      for (let i = 0; i < 15; i++) {
        const y = startY + i * lineHeight + Math.sin(time + i * 0.5) * 3;
        const lineWidth = 100 + Math.sin(time * 0.5 + i) * 50;

        ctx.beginPath();
        ctx.roundRect(40, y, lineWidth, 16, 4);
        ctx.fill();
      }

      // 绘制浮动括号
      const brackets = ['{', '}', '(', ')', '[', ']'];
      brackets.forEach((bracket, i) => {
        const x = 60 + (i % 3) * 120;
        const y = canvas.height * 0.2 + Math.floor(i / 3) * 200 + Math.sin(time + i) * 10;

        ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
        ctx.font = 'bold 48px JetBrains Mono, monospace';
        ctx.fillText(bracket, x, y);
      });

      // 绘制浮动圆点粒子效果
      const particles = [];
      for (let i = 0; i < 8; i++) {
        particles.push({
          x: (Math.sin(time * 0.3 + i * 1.5) + 1) * canvas.width / 2,
          y: canvas.height * 0.5 + Math.cos(time * 0.5 + i * 2) * canvas.height * 0.3,
          radius: 2 + Math.sin(time + i) * 1,
          opacity: 0.3 + Math.sin(time * 2 + i) * 0.2
        });
      }

      particles.forEach(p => {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        gradient.addColorStop(0, `rgba(99, 102, 241, ${p.opacity})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // 绘制底部装饰线条
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const y = canvas.height * 0.85 + i * 20;
        const offsetX = Math.sin(time + i) * 30;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(
          canvas.width * 0.25, y + offsetX,
          canvas.width * 0.75, y - offsetX,
          canvas.width, y
        );
        ctx.stroke();
      }
    };

    // 颜色调整辅助函数
    const adjustColor = (color, amount) => {
      const hex = color.replace('#', '');
      const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
      const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
      const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    // 初始化
    resizeCanvas();
    render();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default QuickSortBackground;
