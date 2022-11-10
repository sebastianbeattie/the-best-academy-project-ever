const navItem = `
<a href="http://localhost:3000" class="ssrcss-1qc9pyg-NavigationLink e1gviwgp17">
    <span class="ssrcss-684v2a-NavItemHoverState e1gviwgp18">
        <span class="ssrcss-7wo4m3-ServiceIdentifierIconWrapper e1wqaj770">
            <svg viewBox="0 0 336 336" width="1em" height="1em" class="ssrcss-xi5oyi-StyledIcon e6m7o991" focusable="false" aria-hidden="true">
                <g>
                    <path fill="#00d600" d="M214,336h-68c-0.6,0-1.1-0.2-1.4-0.6s-0.6-0.9-0.6-1.4V218c0-0.6,0.2-1.1,0.6-1.4s0.9-0.6,1.4-0.6h68 c0.6,0,1.1,0.2,1.4,0.6s0.6,0.9,0.6,1.4v116c0,0.6-0.2,1.1-0.6,1.4S214.6,336,214,336z">
                    </path>
                    <path fill="#009800" d="M334,192H146c-0.6,0-1.1-0.2-1.4-0.6s-0.6-0.9-0.6-1.4V2c0-0.6,0.2-1.1,0.6-1.4S145.4,0,146,0h188 c0.6,0,1.1,0.2,1.4,0.6S336,1.4,336,2v188c0,0.6-0.2,1.1-0.6,1.4S334.6,192,334,192z">
                    </path>
                    <path fill="#00f100" d="M118,240H2c-0.6,0-1.1-0.2-1.4-0.6S0,238.6,0,238V122c0-0.6,0.2-1.1,0.6-1.4S1.4,120,2,120h116 c0.6,0,1.1,0.2,1.4,0.6s0.6,0.9,0.6,1.4v116c0,0.6-0.2,1.1-0.6,1.4S118.6,240,118,240z">
                    </path>
                </g>
            </svg>
        </span>Academy Quiz</span>
</a>
`;

var navbar = document.querySelector("#header-content > nav > div.ssrcss-1ocoo3l-Wrap.e42f8511 > div > div.ssrcss-fr8ebb-GlobalNavigationItem.e1gviwgp23 > ul.ssrcss-1p6tp05-ChameleonGlobalNavigationLinkList-En.e16i5fd20 > li.ssrcss-15542on-GlobalNavigationProduct.e1gviwgp22");

navbar.insertAdjacentHTML("afterend", navItem);