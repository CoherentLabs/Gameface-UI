const buttonToCode = (btn: number): string | null => {
  switch (btn) {
        case 0: return "LMB";
        case 1: return "MMB";
        case 2: return "RMB";
        case 3: return "BMB";
        case 4: return "FMB";
        default: return null;
  }
};

export default buttonToCode;