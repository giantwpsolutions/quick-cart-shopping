/**
 * Progress Bar Renderer for Multi-Step Checkout
 *
 * @package Quick Cart Shopping
 * @since 1.0.0
 */

import { DOM } from '../utils/dom.js';
import { ColorUtils } from '../utils/colorUtils.js';

export class ProgressBarRenderer {
  /**
   * Render progress bar based on style
   *
   * @param {Array} steps - Array of steps
   * @param {number} currentStep - Current step index
   * @param {object} settings - Checkout settings
   * @returns {HTMLElement} Progress bar element
   */
  static render(steps, currentStep, settings) {
    const style = settings.checkout?.progressBarStyle || 'style1';
    const barColor = settings.checkout?.progressBarColor || '#05291B';
    const barColorDark = ColorUtils.darken(barColor, 20);
    const textColor = settings.checkout?.progressLabelTextColor || '#ffffff';

    const cssVars = `--qc-bar-color: ${barColor}; --qc-bar-color-dark: ${barColorDark}; --qc-text-color: ${textColor};`;

    let progressHTML = '';

    if (style === 'style1') {
      progressHTML = this.renderStyle1(steps, currentStep, cssVars);
    } else if (style === 'style2') {
      progressHTML = this.renderStyle2(steps, currentStep, cssVars);
    } else if (style === 'style3') {
      progressHTML = this.renderStyle3(steps, currentStep, cssVars);
    }

    return DOM.createFromHTML(progressHTML);
  }

  /**
   * Render Style 1: Steps + Line
   */
  static renderStyle1(steps, currentStep, cssVars) {
    const stepsHTML = steps.map((step, index) => {
      const isActive = index === currentStep;
      const isCompleted = index < currentStep;
      return `
        <div class="qc-step ${isActive ? 'qc-step-active' : ''} ${isCompleted ? 'qc-step-completed' : ''}">
          <div class="qc-step-circle">${isCompleted ? '✓' : step.id}</div>
          <div class="qc-step-label">${step.label}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="qc-progress qc-progress-style1" style="${cssVars}">
        <div class="qc-progress-line">
          <div class="qc-progress-fill" style="width: ${(currentStep / (steps.length - 1)) * 100}%;"></div>
        </div>
        <div class="qc-steps">${stepsHTML}</div>
      </div>
    `;
  }

  /**
   * Render Style 2: Pill Segments
   */
  static renderStyle2(steps, currentStep, cssVars) {
    const stepsHTML = steps.map((step, index) => {
      const isActive = index === currentStep;
      const isCompleted = index < currentStep;
      return `
        <div class="qc-step ${isActive ? 'qc-step-active' : ''} ${isCompleted ? 'qc-step-completed' : ''}">
          <div class="qc-mini"></div>
          <div class="qc-step-label">${step.label}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="qc-progress qc-progress-style2" style="${cssVars}">
        <div class="qc-pill">
          <div class="qc-steps">${stepsHTML}</div>
        </div>
      </div>
    `;
  }

  /**
   * Render Style 3: Thin Line + Marker
   */
  static renderStyle3(steps, currentStep, cssVars) {
    const labelsHTML = steps.map((step, index) => {
      const isActive = index === currentStep;
      return `<div class="qc-step-label ${isActive ? 'qc-active' : ''}">${step.label}</div>`;
    }).join('');

    return `
      <div class="qc-progress qc-progress-style3" style="${cssVars}">
        <div class="qc-labels">${labelsHTML}</div>
        <div class="qc-progress-line">
          <div class="qc-progress-fill" style="width: ${(currentStep / (steps.length - 1)) * 100}%;"></div>
          <div class="qc-marker" style="left: calc(${(currentStep / (steps.length - 1)) * 100}% - 11px);"></div>
        </div>
      </div>
    `;
  }

  /**
   * Update progress bar to show current step
   */
  static update(progressElement, steps, currentStep, style) {
    // Update progress fill width
    const fill = DOM.qs('.qc-progress-fill', progressElement);
    if (fill) {
      fill.style.width = `${(currentStep / (steps.length - 1)) * 100}%`;
    }

    if (style === 'style3') {
      this.updateStyle3(progressElement, steps, currentStep);
    } else {
      this.updateStyle1And2(progressElement, steps, currentStep, style);
    }
  }

  /**
   * Update Style 3 progress bar
   */
  static updateStyle3(progressElement, steps, currentStep) {
    const marker = DOM.qs('.qc-marker', progressElement);
    if (marker) {
      marker.style.left = `calc(${(currentStep / (steps.length - 1)) * 100}% - 11px)`;
    }

    const labels = DOM.qsa('.qc-step-label', progressElement);
    labels.forEach((label, index) => {
      if (index === currentStep) {
        label.classList.add('qc-active');
      } else {
        label.classList.remove('qc-active');
      }
    });
  }

  /**
   * Update Style 1 & 2 progress bars
   */
  static updateStyle1And2(progressElement, steps, currentStep, style) {
    const stepElements = DOM.qsa('.qc-step', progressElement);
    stepElements.forEach((el, index) => {
      const isActive = index === currentStep;
      const isCompleted = index < currentStep;

      el.className = `qc-step ${isActive ? 'qc-step-active' : ''} ${isCompleted ? 'qc-step-completed' : ''}`;

      if (style === 'style1') {
        const circle = DOM.qs('.qc-step-circle', el);
        if (circle) {
          circle.innerHTML = isCompleted ? '✓' : steps[index].id;
        }
      }
    });
  }
}
