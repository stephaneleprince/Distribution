import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {easeLinear} from 'd3-ease'
import {interpolate} from 'd3-interpolate'
import {scaleLinear} from 'd3-scale'
import {select} from 'd3-selection'
import {arc, area} from 'd3-shape'
import {transition} from 'd3-transition'

// largely inspired from http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6

const LIQUID_GAUGE_CONFIG = {
  minValue: 0,             // The gauge minimum value.
  maxValue: 100,           // The gauge maximum value.
  circleThickness: 0.08,   // The outer circle thickness as a percentage of it's radius.
  circleFillGap: 0.06,     // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
  waveHeight: 0.09,        // The wave height as a percentage of the radius of the wave circle.
  waveCount: 0.85,         // The number of full waves per width of the wave circle.
  waveRiseTime: 2000,      // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
  waveAnimateTime: 2600,   // The amount of time in milliseconds for a full wave to enter the wave circle.
  waveRise: true,          // Control if the wave should rise from 0 to it's full height, or start at it's full height.
  waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
  waveOffset: 0,           // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
  textVertPosition: .5,    // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
  textSize: 1,             // The relative height of the text to display in the wave circle. 1 = 50%
  displayPercent: true     // If true, a % symbol is displayed after the value.
}

/**
 * Renders the Gauge SVG area.
 */
const GaugeContainer = props => {
  const locationX = parseInt(props.width)/2 - props.radius;
  const locationY = parseInt(props.height)/2 - props.radius;

  return (
    <svg
      width={props.width}
      height={props.height}
      className={classes('gauge liquid-gauge', `liquid-gauge-${props.type}`, props.className)}
    >
      <g transform={`translate(${locationX}, ${locationY})`}>
        {props.children}
      </g>
    </svg>
  )
}

GaugeContainer.propTypes = {
  className: T.string,
  type: T.oneOf(['primary', 'success', 'warning', 'danger', 'info', 'user']).isRequired,
  width: T.oneOfType([T.string, T.number]).isRequired,
  height: T.oneOfType([T.string, T.number]).isRequired,
  radius: T.number.isRequired,
  children: T.node
}

/**
 * Renders the Gauge outer circle.
 */
const GaugeBorder = props => {
  const circleX = scaleLinear().range([0, 2*Math.PI]).domain([0, 1]);
  const circleY = scaleLinear().range([0, props.radius]).domain([0, props.radius]);

  const circleArc = arc()
    .startAngle(circleX(0))
    .endAngle(circleX(1))
    .outerRadius(circleY(props.radius))
    .innerRadius(circleY(props.radius - props.thickness))

  return (
    <path
      className="gauge-border"
      d={circleArc()}
      transform={`translate(${props.radius}, ${props.radius})`}
    />
  )
}

GaugeBorder.propTypes = {
  radius: T.number.isRequired,
  thickness: T.number.isRequired
}

class GaugeText extends Component {
  componentDidMount() {
    // Make the value count up.
    if (!this.props.preFilled) {
      const textTween = function(node, value, percentText) {
        const currentValue = node.text().replace('%', '')
        const i = interpolate(currentValue, Math.round(value))

        return function(t) {
          const newValue = Math.round(i(t)) + percentText

          node.text(newValue)
        }
      }

      // generates filling transition
      const value = this.props.value
      const percentText = this.computed.percentText

      // append transition to text nodes
      const text = select(this.text)
      text
        .transition()
        .duration(LIQUID_GAUGE_CONFIG.waveRiseTime)
        .tween('text', () => textTween(text, value, percentText))

      const fillingText = select(this.fillingText)
      fillingText
        .transition()
        .duration(LIQUID_GAUGE_CONFIG.waveRiseTime)
        .tween('text', () => textTween(fillingText, value, percentText))
    }
  }

  render() {
    // Scale for controlling the position of the text within the gauge.
    const textRiseScaleY = scaleLinear()
      .range([fillCircleMargin+fillCircleRadius*2, (fillCircleMargin+textPixels*0.7)])
      .domain([0, 1])

    return (
      <text
        ref={el => this.text = el}
        className="gauge-text"
        fontSize={this.computed.textPixels}
        textAnchor="middle"
        transform={`translate(${this.computed.radius}, ${textRiseScaleY(LIQUID_GAUGE_CONFIG.textVertPosition)})`}
      >
        {Math.round(this.computed.textStartValue) + (this.props.showPercent ? '%':'')}
      </text>
    )
  }
}

GaugeText.propTypes = {
  showPercent: T.bool
}

class LiquidGauge extends Component {
  constructor(props) {
    super(props)

    this.computeConfiguration()
  }

  computeConfiguration() {
    const radius = Math.min(parseInt(this.props.width), parseInt(this.props.height))/2;

    const fillPercent = Math.max(LIQUID_GAUGE_CONFIG.minValue, Math.min(LIQUID_GAUGE_CONFIG.maxValue, this.props.value))/LIQUID_GAUGE_CONFIG.maxValue

    let waveHeightScale
    if (LIQUID_GAUGE_CONFIG.waveHeightScaling){
      waveHeightScale = scaleLinear()
        .range([0, LIQUID_GAUGE_CONFIG.waveHeight, 0])
        .domain([0, 50, 100]);
    } else {
      waveHeightScale = scaleLinear()
        .range([config.waveHeight, LIQUID_GAUGE_CONFIG.waveHeight])
        .domain([0, 100]);
    }

    const textPixels = LIQUID_GAUGE_CONFIG.textSize*radius/2;
    const textFinalValue = parseFloat(this.props.value).toFixed(2);
    const textStartValue = !this.props.preFilled ? LIQUID_GAUGE_CONFIG.minValue : textFinalValue;
    const percentText = LIQUID_GAUGE_CONFIG.displayPercent ? "%":"";
    const circleThickness = LIQUID_GAUGE_CONFIG.circleThickness * radius;
    const circleFillGap = LIQUID_GAUGE_CONFIG.circleFillGap * radius;
    const fillCircleMargin = circleThickness + circleFillGap;
    const fillCircleRadius = radius - fillCircleMargin;
    const waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);

    const waveLength = fillCircleRadius*2/LIQUID_GAUGE_CONFIG.waveCount;
    const waveClipCount = 1+LIQUID_GAUGE_CONFIG.waveCount;
    const waveClipWidth = waveLength*waveClipCount;

    // Scales for controlling the size of the clipping path.
    var waveScaleX = scaleLinear().range([0, waveClipWidth]).domain([0,1]);
    var waveScaleY = scaleLinear().range([0, waveHeight]).domain([0,1]);

    // Scales for controlling the position of the clipping path.
    var waveRiseScale = scaleLinear()
    // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
    // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
    // circle at 100%.
      .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
      .domain([0,1]);

    // Scale for controlling the position of the text within the gauge.
    var textRiseScaleY = scaleLinear()
      .range([fillCircleMargin+fillCircleRadius*2, (fillCircleMargin+textPixels*0.7)])
      .domain([0,1]);

    this.computed = {
      radius,
      fillPercent,
      waveHeightScale,
      textPixels,
      textFinalValue,
      textStartValue,
      percentText,
      circleThickness,
      circleFillGap,
      fillCircleMargin,
      fillCircleRadius,
      waveHeight,
      waveClipCount,
      waveClipWidth,
      waveScaleX,
      waveScaleY,
      waveRiseScale,
      textRiseScaleY
    }
  }

  componentDidMount() {
    // Make the value count up.
    if (!this.props.preFilled) {
      const textTween = function(node, value, percentText) {
        const currentValue = node.text().replace('%', '')
        const i = interpolate(currentValue, Math.round(value))

        return function(t) {
          const newValue = Math.round(i(t)) + percentText

          node.text(newValue)
        }
      }

      // generates filling transition
      const value = this.props.value
      const percentText = this.computed.percentText

      // append transition to text nodes
      const text = select(this.text)
      text
        .transition()
        .duration(LIQUID_GAUGE_CONFIG.waveRiseTime)
        .tween('text', () => textTween(text, value, percentText))

      const fillingText = select(this.fillingText)
      fillingText
        .transition()
        .duration(LIQUID_GAUGE_CONFIG.waveRiseTime)
        .tween('text', () => textTween(fillingText, value, percentText))
    }

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    const wave = select(this.wave)
    const waveDef = select(this.waveDef)

    var waveGroupXPosition = this.computed.fillCircleMargin+this.computed.fillCircleRadius*2-this.computed.waveClipWidth;
    if (LIQUID_GAUGE_CONFIG.waveRise){
      waveDef
        .attr('transform', 'translate('+waveGroupXPosition+','+this.computed.waveRiseScale(0)+')')
        .transition()
        .duration(LIQUID_GAUGE_CONFIG.waveRiseTime)
        .attr('transform', 'translate('+waveGroupXPosition+', '+this.computed.waveRiseScale(this.computed.fillPercent)+')')
        // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false.
        // The wave will not position correctly without this, but it's not clear why this is actually necessary.
        .on('start', () => wave.attr('transform', 'translate(1, 0)'))
    } else {
      waveDef
        .attr('transform', 'translate('+waveGroupXPosition+','+this.computed.waveRiseScale(this.computed.fillPercent)+')')
    }

    if (this.props.wave) {
      const waveAnimateScale = scaleLinear()
        .range([0, this.computed.waveClipWidth-this.computed.fillCircleRadius*2]) // Push the clip area one full wave then snap back.
        .domain([0, 1]);

      animateWave(waveAnimateScale)
    }

    function animateWave(waveAnimateScale) {
      wave
        .attr('transform', 'translate('+waveAnimateScale(wave.attr('T'))+', 0)')
        .transition()
        .duration(LIQUID_GAUGE_CONFIG.waveAnimateTime * (1-wave.attr('T')))
        .ease(easeLinear)
        .attr('transform', 'translate('+waveAnimateScale(1)+', 0)')
        .attr('T', 1)
        .on('end', function() {
          wave.attr('T', 0)

          animateWave(waveAnimateScale)
        })
    }
  }

  render() {
    // The clipping wave area.
    // Data for building the clip wave area.
    const data = [];
    for (let i = 0; i <= 40*this.computed.waveClipCount; i++){
      data.push({x: i/(40*this.computed.waveClipCount), y: (i/(40))});
    }

    const clipArea = area()
      .x(d => this.computed.waveScaleX(d.x))
      .y0(d => this.computed.waveScaleY(Math.sin(Math.PI*2*LIQUID_GAUGE_CONFIG.waveOffset*-1 + Math.PI*2*(1-LIQUID_GAUGE_CONFIG.waveCount) + d.y*2*Math.PI)))
      .y1(d => this.computed.fillCircleRadius*2 + this.computed.waveHeight);

    return (
      <GaugeContainer
        className={this.props.className}
        type={this.props.type}
        width={this.props.width}
        height={this.props.height}
        radius={this.computed.radius}
      >
        <GaugeBorder
          radius={this.computed.radius}
          thickness={this.computed.circleThickness}
        />

        <text
          ref={el => this.text = el}
          className="gauge-text"
          fontSize={this.computed.textPixels}
          textAnchor="middle"
          transform={`translate(${this.computed.radius}, ${this.computed.textRiseScaleY(LIQUID_GAUGE_CONFIG.textVertPosition)})`}
        >
          {Math.round(this.computed.textStartValue) + this.computed.percentText}
        </text>

        <defs>
          <clipPath
            ref={el => this.waveDef = el}
            id={`clipWave${this.props.id}`}
          >
            <path
              ref={el => this.wave = el}
              d={clipArea(data)}
              T={0}
            />
          </clipPath>
        </defs>

        <g clipPath={`url(#clipWave${this.props.id})`}>
          <circle
            className="gauge-liquid"
            cx={this.computed.radius}
            cy={this.computed.radius}
            r={this.computed.fillCircleRadius}
          />

          <text
            ref={el => this.fillingText = el}
            className="gauge-liquid-text"
            textAnchor="middle"
            fontSize={this.computed.textPixels}
            transform={`translate(${this.computed.radius}, ${this.computed.textRiseScaleY(LIQUID_GAUGE_CONFIG.textVertPosition)})`}
          >
            {Math.round(this.computed.textStartValue) + this.computed.percentText}
          </text>
        </g>
      </GaugeContainer>
    )
  }
}

LiquidGauge.propTypes = {
  /**
   * An unique identifier for the Gauge.
   */
  id: T.string.isRequired,

  className: T.string,

  /**
   * The type of the Gauge (to apply correct color scheme).
   */
  type: T.oneOf(['primary', 'success', 'warning', 'danger', 'info', 'user']),

  /**
   * The available width for the Gauge.
   */
  width: T.number,

  /**
   * The available height for the Gauge.
   */
  height: T.number,


  /**
   * The current value.
   */
  value: T.number,

  preFilled: T.bool,
  wave: T.bool
}

LiquidGauge.defaultProps = {
  type: 'primary',
  width: 80,
  height: 80,
  value: 40,
  preFilled: false,
  wave: true
}

export {
  LiquidGauge
}
