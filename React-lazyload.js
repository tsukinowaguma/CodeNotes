'use strict';
//关于react延迟加载
let React = require('react');

// utils
let _ = require('underscore');
let StyleMarker = require('react-style-marker');

module.exports = React.createClass({

    getInitialState() {
        return {
            visible: false
        }
    },

    handleScrollInnter() {

        let coverDom = this.refs.preCoverDOM;
        // 加载界限中，额外提供的1000px
        let extraOffset = 1000;
        if (coverDom) {
            let bounds_ = this.refs.preCoverDOM.getDOMNode().getBoundingClientRect();

            if (bounds_.top <= (window.innerHeight + extraOffset)
                && bounds_.bottom > -extraOffset) {
                this.handleVisible();
                this.setState({visible: true});
            }
        }
    },

    handleVisible() {
        // 添加/移除事件全部使用捕获的模式
        window.removeEventListener('scroll', this.handleScroll, true);
        window.removeEventListener('resize', this.handleScroll, true);

        // 自定义事件
        if (this.props.selfDefinedEvent) {
            window.removeEventListener(this.props.selfDefinedEvent, this.handleScroll, true);
        }
    },

    componentDidMount() {
        this.handleScroll = _.throttle(this.handleScrollInnter, 200, {trailing: false});
        window.addEventListener('scroll', this.handleScroll, true);
        window.addEventListener('resize', this.handleScroll, true);

        // 自定义事件
        if (this.props.selfDefinedEvent) {
            window.addEventListener(this.props.selfDefinedEvent, this.handleScroll, true);
        }

        this.handleScroll();
    },
    componentDidUpdate: function () {
        if (!this.state.visible) this.handleScroll();
    },

    componentWillUnmount: function () {
        this.handleVisible();
    },

    render() {
        let url = this.props.url;
        let styleClass = this.props.styleClass;

        let height = this.props.height || 100;
        let width = this.props.width || 100;


        let T = StyleMarker.trans;
        T('myImageSize=width(' + width + ') + height(' + height + ')');

        // TODO : 添加默认图片显示
        return this.state.visible ? (
            <img src={url} className={styleClass || ''} />
        ) : (
            <div>
                <div className='clear-both'></div>
                <div style={T('myImageSize')} className='clear-both' ref='preCoverDOM'> </div>
                <div className='clear-both'></div>
            </div>
        );
    }
});