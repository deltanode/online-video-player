"use client";

import React, { useState } from 'react';
import VLPlayerCore from '@viewlift/player-backup/esm/index';
import '@viewlift/player-backup/esm/bundle.css'
import Header from './Header';

export default function VideoPlayer() {
  const VlCore = VLPlayerCore()
  let playerVersion = 'v2.0.10-beta'
  // if (typeof window !== "undefined") {
  //   playerVersion = "v" + window?.vl_player_version
  // }
  const [mode, setMode] = useState('direct'); // 'config' or 'direct'
  const [error, setError] = useState('');
  const [disableControls, setDisableControls] = useState(false);
  const [configInputs, setConfigInputs] = useState({
    token: '',
    videoId: '',
    apiBaseUrl: '',
    sourceUrl: '',
    autoplay: true,
    mute: true,
    theme: 'defaultV2', 
  });

  const handleMode = (mode) => {
    setError("")
    setMode(mode)
  }

  const handleChange = (e) => {
    setError("")
    setConfigInputs({ ...configInputs, [e.target.name]: e.target.value });
  };
  
  const initialtePlayer = () => {
    const playerId = 'my-player';
    let videoId = configInputs?.videoId
    let token = configInputs?.token
    let apiBaseUrl = configInputs?.apiBaseUrl
    let videoSourceUrl = configInputs?.sourceUrl

    if(mode === "config" && (!videoId || !token || !apiBaseUrl)) return setError("Missing Configuration Values")
    else if (mode === "direct" && !videoSourceUrl) return setError("Missing Configuration Values")
    if(!disableControls) setDisableControls(true)
    let config = {
      playerId,
      videoId,
      token,
      videoSourceUrl,
      apiBaseUrl, 
      muted: configInputs?.mute,
      autoplay: configInputs?.autoplay,
      skin: configInputs?.theme || 'VL_ONE',
      // airplay:true,
      // enableAdvertisements:false,
      // chromecastReceiverId: '764F169F',
      // showPositiveSeekbar: false,
    }
    console.log("config:", config)
    
    if (mode === "config" && VlCore?.isPlayerInitialised(playerId)){
      VlCore.load(playerId, videoId, token)
      .catch((e) => {
        const errorMsg = (typeof e === "string") ? e : (e?.response?.response?.data?.errorCode || e?.msg)
        setError( errorMsg || "Something went wrong")
        console.error("Error: ", e)
      })
      // return
    }else if(mode === "direct" && VlCore?.isPlayerInitialised(playerId)){
      VlCore.loadVideoInstantly(playerId, videoSourceUrl)
      .catch((e) => {
        const errorMsg = (typeof e === "string") ? e : (e?.response?.response?.data?.errorCode || e?.msg)
        setError( errorMsg || "Something went wrong")
        console.error("Error: ", e)
      })
      // VlCore.dispose(playerId)
      // add the html again i.e videojs tag
      // Now, again initilise player i.e  VLPlayerCore().init(config)
    } else {
     VlCore.init(config).then((e)=>{
        console.log("init response: ",e);
      })
      .catch((e) => {
        const errorMsg = (typeof e === "string") ? e : (e?.response?.response?.data?.errorCode || e?.msg)
        setError( errorMsg || "Something went wrong")
        console.error("Error: ", e)
      })
    }
  }

  const handleLoad = () => {
    setError("")
    console.log('Player Load Triggered');

    if (mode === 'config') {
      setConfigInputs({ ...configInputs, sourceUrl: "" });
      console.log('Config Input:', configInputs.token, configInputs.videoId, configInputs.apiBaseUrl);
      // Call your player init with token, videoId, apiBaseUrl
      // initPlayer(config);
    } 
    // else {
      // console.log('Source URL:', configInputs.sourceUrl);
      // Call your player with source URL
      // initWithUrl(config.sourceUrl);
    // }
    initialtePlayer()
  };

  // useEffect(() => {
  //   return () => {
  //     // VLPlayerCore()?.dispose(playerId) 
  //   }
  // })

  return (
     <div className="min-h-screen bg-gray-100 text-gray-800">
      <Header playerVersion={playerVersion}/>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row gap-6 p-6">
        {/* Form Section */}
        <div className="w-full md:w-1/2 bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Add Player Config</h2>

          <div className="flex mb-4">
            <button
              className={`flex-1 py-2 rounded-l-xl text-sm font-medium transition ${ mode === 'direct' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => handleMode('direct')}
            >
              Direct Source
            </button>
            <button
              className={`flex-1 py-2 rounded-r-xl text-sm font-medium transition ${mode === 'config' ? 'bg-blue-600 text-white': 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => handleMode('config')}
            >
              Config-Based
            </button>
          </div>

          {mode === 'config' ? (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Video ID</label>
                <input
                  type="text"
                  name="videoId"
                  value={configInputs.videoId}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>
               <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Token</label>
                <input
                  type="text"
                  name="token"
                  value={configInputs.token}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">API Base URL</label>
                <input
                  type="text"
                  name="apiBaseUrl"
                  value={configInputs.apiBaseUrl}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>
            </>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Source URL (MP4 / M3U8 / MPD)</label>
              <input
                type="text"
                name="sourceUrl"
                value={configInputs.sourceUrl}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded text-sm"
              />
            </div>
          )}
          
          {/* Autoplay Toggle */}
          <div className="mb-3 flex items-center gap-2">
            <input
              type="checkbox"
              name="autoplay"
              checked={configInputs.autoplay}
              disabled={disableControls}
              onChange={(e) =>
                handleChange({ target: { name: 'autoplay', value: e.target.checked } })
              }
              className="form-checkbox"
            />
            <label className="text-sm font-medium">Autoplay</label>
          </div>

          {/* Mute Toggle */}
          <div className="mb-3 flex items-center gap-2">
            <input
              type="checkbox"
              name="mute"
              checked={configInputs.mute}
              disabled={disableControls}
              onChange={(e) =>
                handleChange({ target: { name: 'mute', value: e.target.checked } })
              }
              className="form-checkbox"
            />
            <label className="text-sm font-medium">Mute</label>
          </div>

          {/* Theme Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Theme</label>
            <select
              name="theme"
              value={configInputs.theme}
              onChange={handleChange}
              disabled={disableControls}
              className="w-full border px-3 py-2 rounded text-sm"
            >
              <option value="defaultV2">defaultV2</option>
              <option value="vl-one">vl-one</option>
            </select>
          </div>

          <button
            onClick={handleLoad}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            Load Player
          </button>
          {/* error */}
          <div className='text-center text-red-600 py-2'>
               {error && error}
          </div>
        </div>

        {/* Video Player Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <div className="w-full bg-white rounded-xl shadow overflow-hidden">
            <div className="bg-gray-800 text-white text-center py-2 font-semibold">
              Player Preview
            </div>
            <div className="aspect-video bg-black">
              <video
                id="my-player"
                className="video-js w-full h-full"
              ></video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
