const baseUrl = "https://developer-lostark.game.onstove.com";

async function getCharacterData(characterName) {
  const response = await fetch(
    `${baseUrl}/armories/characters/${characterName}/profiles`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization:
          "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDA1ODE3NTAifQ.Mro6aYVYBDwIXzMFAZ4bURc6-9mls6_EmbT286tGB61rdhKg61lZrqxYj73Bpd6QCXY84ZKJn54EEFq9W2TguIWQK4OhrQrHgY-LE1DegnPXMCtRdlmA-1E9akGZiKXk2mN777xvrH7n2E2yrHDbORW3yksdu2Gem5VbXEqEtJJSZIDRBfb7GZGVQ8pO6lHLvqCMoKfzJO5i0OoDqPihZYoZTdNQ-fZa4nxkAbPWNHbtpGzacibmp_Fcnk0CLQx37448-olnzk7-PT84uCDiMfFI2gLHDue-KlwyIkwhwkFhfvCqapOkFYbHQp9IiP-dGmrx1bTkp44M9swl2j9MFw",
      },
    }
  );
  const result = await response.json();
  if (result != null) {
    return {
      CharacterName: result.CharacterName,
      CharacterClassName: result.CharacterClassName,
      ItemAvgLevel: result.ItemAvgLevel,
      CombatPower: result.CombatPower,
    };
  }
  return {
    CharacterName: characterName,
    CharacterClassName: "error",
    ItemAvgLevel: "error",
    CombatPower: "error",
  };
}

module.exports = getCharacterData;
