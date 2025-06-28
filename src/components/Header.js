import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation';

const version = {
  "v2.0.19": "/",
  "v2.0.10-beta": "beta-version",
  // Add more versions as needed
}

const Header = (props) => {
  const { playerVersion } = props
  const router = useRouter();
  // const { playerVersion: inputPlayerVersion } = props
  // console.log("inputPlayerVersion", inputPlayerVersion)
  // const [playerVersion, setPlayerVersion] = useState(inputPlayerVersion);
  // const pathname = usePathname();

  const handleVersionChange = (e) => {
    const selectedVersion = e.target.value;
    // setPlayerVersion(selectedVersion);
    router.push(`/${version[selectedVersion]}`);
  };

  // useEffect(() => {
  //   const currentVersion = inputPlayerVersion;
  //   console.log("currentVersion: ", currentVersion)
  //   setPlayerVersion(currentVersion);
  // }, [pathname]);

  return (
    <div className="relative bg-white shadow px-6 py-4 text-2xl font-bold text-center border-b">
      {/* Title */}
       VL WEB PLAYER

      {/* Version Dropdown */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <select
          className="border border-gray-300 rounded px-2 py-1 text-base text-black"
          value={playerVersion}
          onChange={handleVersionChange}
        >
          {
            Object.keys(version)?.map(versionValue => {
              return (
                <option value={versionValue}>{versionValue}</option>
              )
            })
          }
        </select>
      </div>
    </div>
  )
}

export default Header