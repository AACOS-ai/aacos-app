type SignalEntry = {
  text: string;
  timestamp: number;
};

class SignalRecorder {
  private _log: SignalEntry[] = [];

  record(signalText: string) {
    this._log.push({
      text: signalText,
      timestamp: Date.now(),
    });
  }

  get history(): SignalEntry[] {
    return [...this._log];
  }

  get last(): SignalEntry | undefined {
    return this._log[this._log.length - 1];
  }

  clear() {
    this._log = [];
  }
}

// ייצוא אובייקט גלובלי יחיד
export const signalRecorder = new SignalRecorder();
