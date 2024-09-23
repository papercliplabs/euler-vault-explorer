import { VAULT_TYPE_INFO_MAPPING } from "@/utils/constants";
import { VaultType } from "@/utils/types";
import { VaultTypeIcon } from "./Icons";

const INCLUDED_VAULT_TYPES: VaultType[] = ["escrowedCollateral", "governed", "ungoverned-0x", "factory"];

interface VaultTypeDescriptorProps {
  type?: VaultType; // undefined for all vault types
}

export default function VaultTypeDescriptor({ type }: VaultTypeDescriptorProps) {
  const types = type ? [type] : INCLUDED_VAULT_TYPES;
  return (
    <div className="flex flex-col gap-6">
      {types.map((type, i) => {
        const info = VAULT_TYPE_INFO_MAPPING[type];
        return (
          <div className="flex gap-4" key={i}>
            <VaultTypeIcon type={type} className="shrink-0" />
            <div className="flex flex-col">
              <span className="body-sm font-medium">{info.name}</span>
              <span>{info.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
