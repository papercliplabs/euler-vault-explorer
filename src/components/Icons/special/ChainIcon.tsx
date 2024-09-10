import { cn } from "@/utils/shadcn";
import { SupportedChainId } from "@/utils/types";
import { SVGProps } from "react";
import { mainnet } from "viem/chains";

interface ChainIconProps extends SVGProps<SVGSVGElement> {
  chainId: SupportedChainId;
}

const svgContent: Record<SupportedChainId, JSX.Element> = {
  [mainnet.id]: (
    <>
      <g clipPath="url(#clip0_27_6246)">
        <rect width="32" height="32" rx="16" fill="white" />
        <rect width="32" height="32" fill="#D9D9D9" />
        <path
          d="M16.0031 4.2666L15.8457 4.80138V20.3179L16.0031 20.475L23.2056 16.2175L16.0031 4.2666Z"
          fill="#343434"
        />
        <path d="M16.0024 4.2666L8.7998 16.2175L16.0024 20.475V12.9437V4.2666Z" fill="#8C8C8C" />
        <path
          d="M16.0038 21.8387L15.915 21.9469V27.4741L16.0038 27.7332L23.2106 17.5835L16.0038 21.8387Z"
          fill="#3C3C3B"
        />
        <path d="M16.0024 27.7332V21.8387L8.7998 17.5835L16.0024 27.7332Z" fill="#8C8C8C" />
        <path d="M16.002 20.4751L23.2044 16.2177L16.002 12.9438V20.4751Z" fill="#141414" />
        <path d="M8.7998 16.2177L16.0024 20.4751V12.9438L8.7998 16.2177Z" fill="#393939" />
      </g>
      <defs>
        <clipPath id="clip0_27_6246">
          <rect width="32" height="32" rx="16" fill="white" />
        </clipPath>
      </defs>
    </>
  ),

  //   [arbitrum.id]: (
  //     <>
  //       {" "}
  //       <g clipPath="url(#clip0_6_1928)">
  //         <rect width="32" height="32" rx="16" fill="white" />
  //         <path d="M32 0H0V32H32V0Z" fill="#213147" />
  //         <path
  //           d="M6.16797 11.2946V20.7026C6.16797 21.3074 6.48477 21.8546 7.01277 22.1618L15.1632 26.8658C15.6816 27.1634 16.3248 27.1634 16.8432 26.8658L24.9936 22.1618C25.512 21.8642 25.8384 21.3074 25.8384 20.7026V11.2946C25.8384 10.6898 25.5216 10.1426 24.9936 9.8354L16.8432 5.1314C16.3248 4.8338 15.6816 4.8338 15.1632 5.1314L7.01277 9.8354C6.49437 10.133 6.17757 10.6898 6.17757 11.2946H6.16797Z"
  //           fill="#213147"
  //         />
  //         <path
  //           d="M17.773 17.8234L16.6114 21.0106C16.5826 21.097 16.5826 21.193 16.6114 21.289L18.6082 26.7706L20.9218 25.4362L18.1474 17.8234C18.0802 17.6506 17.8402 17.6506 17.773 17.8234Z"
  //           fill="#12AAFF"
  //         />
  //         <path
  //           d="M20.1084 12.4694C20.0412 12.2966 19.8012 12.2966 19.734 12.4694L18.5724 15.6566C18.5436 15.743 18.5436 15.839 18.5724 15.935L21.846 24.911L24.1596 23.5766L20.1084 12.479V12.4694Z"
  //           fill="#12AAFF"
  //         />
  //         <path
  //           d="M16.002 5.488C16.0596 5.488 16.1172 5.5072 16.1652 5.536L24.978 10.624C25.0836 10.6816 25.1412 10.7968 25.1412 10.912V21.088C25.1412 21.2032 25.074 21.3184 24.978 21.376L16.1652 26.464C16.1172 26.4928 16.0596 26.512 16.002 26.512C15.9444 26.512 15.8868 26.4928 15.8388 26.464L7.02603 21.376C6.92043 21.3184 6.86283 21.2032 6.86283 21.088V10.9024C6.86283 10.7872 6.93003 10.672 7.02603 10.6144L15.8388 5.5264C15.8868 5.4976 15.9444 5.4784 16.002 5.4784V5.488ZM16.002 4C15.6852 4 15.378 4.0768 15.09 4.24L6.27723 9.328C5.71083 9.6544 5.36523 10.2496 5.36523 10.9024V21.0784C5.36523 21.7312 5.71083 22.3264 6.27723 22.6528L15.09 27.7408C15.3684 27.904 15.6852 27.9808 16.002 27.9808C16.3188 27.9808 16.626 27.904 16.914 27.7408L25.7268 22.6528C26.2932 22.3264 26.6388 21.7312 26.6388 21.0784V10.9024C26.6388 10.2496 26.2932 9.6544 25.7268 9.328L16.9044 4.24C16.626 4.0768 16.3092 4 15.9924 4H16.002Z"
  //           fill="#9DCCED"
  //         />
  //         <path d="M10.1641 24.9186L10.9801 22.6914L12.6121 24.045L11.0857 25.4466L10.1641 24.9186Z" fill="#213147" />
  //         <path
  //           d="M15.2502 10.179H13.0134C12.8502 10.179 12.6966 10.2846 12.639 10.4382L7.84863 23.571L10.1622 24.9054L15.4422 10.4382C15.4902 10.3038 15.3942 10.1694 15.2598 10.1694L15.2502 10.179Z"
  //           fill="white"
  //         />
  //         <path
  //           d="M19.1682 10.179H16.9314C16.7682 10.179 16.6146 10.2846 16.557 10.4382L11.085 25.4334L13.3986 26.7678L19.3506 10.4382C19.3986 10.3038 19.3026 10.1694 19.1682 10.1694V10.179Z"
  //           fill="white"
  //         />
  //       </g>
  //       <defs>
  //         <clipPath id="clip0_6_1928">
  //           <rect width="32" height="32" rx="16" fill="white" />
  //         </clipPath>
  //       </defs>
  //     </>
  //   ),

  //   [optimism.id]: (
  //     <>
  //       <g clipPath="url(#clip0_6_1937)">
  //         <rect width="32" height="32" rx="16" fill="white" />
  //         <rect width="32" height="32" fill="#FF0420" />
  //         <path
  //           d="M16.5957 20.1345C16.5061 20.1345 16.4421 20.1089 16.3909 20.0513C16.3525 19.9873 16.3397 19.9169 16.3525 19.8337L18.0101 12.0257C18.0229 11.9361 18.0677 11.8657 18.1445 11.8081C18.2149 11.7505 18.2917 11.7249 18.3749 11.7249H21.5685C22.4581 11.7249 23.1685 11.9105 23.7061 12.2753C24.2501 12.6465 24.5253 13.1777 24.5253 13.8753C24.5253 14.0737 24.4997 14.2849 24.4549 14.5025C24.2565 15.4241 23.8533 16.1025 23.2389 16.5441C22.6373 16.9857 21.8117 17.2033 20.7621 17.2033H19.1429L18.5925 19.8337C18.5733 19.9233 18.5349 19.9937 18.4581 20.0513C18.3877 20.1089 18.3109 20.1345 18.2277 20.1345H16.5957ZM20.8453 15.5457C21.1845 15.5457 21.4725 15.4561 21.7221 15.2705C21.9781 15.0849 22.1445 14.8225 22.2277 14.4769C22.2533 14.3425 22.2661 14.2209 22.2661 14.1185C22.2661 13.8881 22.1957 13.7089 22.0613 13.5873C21.9269 13.4593 21.6901 13.3953 21.3637 13.3953H19.9237L19.4693 15.5457H20.8453Z"
  //           fill="white"
  //         />
  //         <path
  //           d="M11.3346 20.2497C10.381 20.2497 9.60024 20.0257 8.99224 19.5777C8.39064 19.1233 8.08984 18.4705 8.08984 17.6321C8.08984 17.4529 8.10904 17.2417 8.14744 16.9857C8.24984 16.4097 8.39704 15.7185 8.58904 14.9057C9.13304 12.7041 10.541 11.6033 12.8066 11.6033C13.421 11.6033 13.9778 11.7057 14.4642 11.9169C14.9506 12.1153 15.3346 12.4225 15.6162 12.8321C15.8978 13.2353 16.0386 13.7153 16.0386 14.2721C16.0386 14.4385 16.0194 14.6497 15.981 14.9057C15.8594 15.6161 15.7186 16.3137 15.5458 16.9857C15.2642 18.0801 14.7842 18.9057 14.093 19.4497C13.4082 19.9873 12.4866 20.2497 11.3346 20.2497ZM11.5074 18.5217C11.9554 18.5217 12.333 18.3873 12.6466 18.1249C12.9666 17.8625 13.197 17.4593 13.3314 16.9089C13.517 16.1537 13.6578 15.5009 13.7538 14.9377C13.7858 14.7713 13.805 14.5985 13.805 14.4193C13.805 13.6897 13.4274 13.3249 12.6658 13.3249C12.2178 13.3249 11.8338 13.4593 11.5138 13.7217C11.2002 13.9841 10.9762 14.3873 10.8418 14.9377C10.6946 15.4753 10.5538 16.1281 10.4066 16.9089C10.3746 17.0689 10.3554 17.2353 10.3554 17.4145C10.349 18.1569 10.7394 18.5217 11.5074 18.5217Z"
  //           fill="white"
  //         />
  //       </g>
  //       <defs>
  //         <clipPath id="clip0_6_1937">
  //           <rect width="32" height="32" rx="16" fill="white" />
  //         </clipPath>
  //       </defs>
  //     </>
  //   ),
};

export default function ChainIcon({ chainId, className, ...props }: ChainIconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={cn("fill-foreground-base h-6 w-6", className)} {...props}>
      {svgContent[chainId]}
    </svg>
  );
}
