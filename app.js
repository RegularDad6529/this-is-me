// This is Me — PFP Board for 6529 Profiles & Wallets
// Fetches NFT holdings, displays PFP collections in a grid

const API_BASE = 'https://api.6529.io/api';
const RPC_URL = 'https://eth.drpc.org';
const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

// Known PFP collections (contract address lowercase -> name)
// These are collections tracked by 6529's xTDH system that are PFP-type
const KNOWN_PFP_CONTRACTS = {
  '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb': 'CryptoPunks',
  '0x282bdd42f4eb70e7a9d9f40c8fea0825b7f68c5d': 'V1 Cryptopunks (Wrapped)',
  '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d': 'BoredApeYachtClub',
  '0x60e4d786628fea6478f785a6d7e704777c86a7c6': 'MutantApeYachtClub',
  '0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7': 'Meebits',
  '0xbd3531da5cf5857e7cfaa92426877b022e612cf8': 'PudgyPenguins',
  '0x524cab2ec69124574082676e6f654a18df49a048': 'LilPudgys',
  '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b': 'CloneX',
  '0x1a92f7381b9f03921564a437210bb9396471050c': 'Cool Cats',
  '0x1cb1a5e65610aeff2551a50f76a87a7d3fb649c6': 'Cryptoadz',
  '0x79fcdef22feed20eddacbb2587640e45491b757f': 'mfer',
  '0x2acab3dea77832c09420663b0e1cb386031ba17b': 'DeadFellaz',
  '0xd774557b647330c91bf44cfeab205095f7e6c367': 'Nakamigos',
  '0xe785e82358879f061bc3dcac6f0444462d4b5330': 'World Of Women',
  '0xc8adfb4d437357d0a656d4e62fd9a6d22e401aa0': 'CryptoBatz by Ozzy Osbourne',
  '0x1d3ada5856b14d9df178ea5cab137d436dc55f1d': 'Deathbats Club',
  '0xf1268733c6fb05ef6be9cf23d24436dcd6e0b35e': 'Desperate ApeWives',
  '0xd37264c71e9af940e49795f0d3a8336afaafdda9': 'JungleBayApeClub',
  '0x80336ad7a747236ef41f47ed2c7641828a480baa': 'Chimpers',
  '0x9eb6e2025b64f340691e424b7fe7022ffde12438': 'Normies',
  '0x2e239070bcc69d5aab3d3245add5df15d6875638': 'XNORMIES',
  '0x03b8d129a8f6dc62a797b59aa5eebb11ad63dada': 'SMOWL',
  '0xb852c6b5892256c264cc2c888ea462189154d8d7': 'Rektguy',
  '0x54c5e045a442411390fcba60f858831e9a2d0990': 'Regular Punks',
  '0xa3f5998047579334607c47a6a2889bf87a17fc02': 'Wrapped Ether Rock',
  '0xc9d8f15803c645e98b17710a0b6593f097064bef': 'Flyfish Club',
  '0x7d0874f682c42f0fe907baf7785d9dcb5a0b1285': 'ACK PFP?',
  '0xb8ea78fcacef50d41375e44e6814ebba36bb33c4': 'Good Vibes Club',
  '0xee9ee1f4f3324e84e52f23c6ee9ae59e85c28a4e': 'Autocompose PFP',
  '0xc143923eddaeec04a96c43d97284612d1134e837': 'Emoji PFP',
  '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270': 'Art Blocks',
  '0x059edd72cd353df5106d2b9cc5ab83a52287ac3a': 'Art Blocks',
  '0xd4e4078ca3495de5b1d4db434bebc5a986197782': 'Autoglyphs',
  '0x44541d1ff5e8a1ed22566df771995fff9139f122': 'BEEPLE: EVERYDAYS',
  '0x6e5dc5405baefb8c0166bcc78d2692777f2cbffb': 'Beeple Round 2',
  '0x49fa3b13be7e28845d0cdead815dcfd083d4b28c': 'Where My Meme Goes',
  '0x4440732b0d85e2a77dcb2caedfd940154241249a': 'Sam Spratt - Masks of Luci',
  '0x892848074ddea461a15f337250da3ce55580ca85': 'CyberBrokers',
  '0x7afeda4c714e1c0a2a1248332c100924506ac8e6': 'FVCK_CRYSTAL//',
  '0xc178994cb9b66307cd62db8b411759dd36d9c2ee': 'COCKPUNCH by Tim Ferriss',
  '0x42069abfe407c60cf4ae4112bedead391dba1cdb': 'CryptoDickbutts S3',
  '0x088f2a071c684314bd93941dfb2bcad2df13e2c5': 'Trippy Playground',
  '0xb9739de33460dc47d14db4a749739a2cc8b41356': 'Smols',
  '0x184ddb67e2ef517f6754f055b56905f2a9b29b6a': 'EmblemOpen',
  '0xe83c84e77ccc5f22be6754ee9a25aab9d6def36c': 'dying is not enough',
  '0x6484bd276cc46baa1b75b08f745ffc1bcb1c70de': 'exist to submit',
  '0x8365382935f0fb94b9f0b07524b535ec13d35ad7': 'gristle buddeez worldwide',
  '0x70a84a01d22f1e1c508a65c0ebd47baa0cdea454': 'Memes by Batz',
  '0xc2c747e0f7004f9e8817db2ca4997657a7746928': 'Hashmasks',
  '0x036721e5a769cc48b3189efbb9cce4471e8a48b1': 'Checks',
  '0x7567401c84764ef0318ee7ba365c7e677c0618ae': 'Hugo Faz - CryptoArt',
  '0x4e77234831c9f70a4ef54d038bcd8e835a07bdd9': 'Kristopher Shinn 1/1',
  '0xcee443c8e1aef5131ccae598dadf510b3d67a072': 'DEEKAY 1/1',
  '0x8b3e6f1f3806290fb99d6a7792242320a886774f': 'After Me',
  '0xda149c88e6340118644f29039f94790722f1bbb6': 'OMbuilder',
  '0xa471f4da9b79645f4f5358e102c62f59c1329aa5': 'beef brothko',
  '0x4dc171080dfd7aa66ca4316314b234727f06957b': 'Love Blossoms',
  '0x7c54eed83f522663a16c6dbcc2fc34669abc7f07': 'OBLIVION',
  '0xfc7702fc55a619ba1628f6d48f03b385a42045b2': "THAT'S SOME BULLSHIT",
  '0x45fabf53ae92993': 'Alpha Centauri Kid',
  '0xd33bc0af2dc4e39cbaef4beff8d1fb3c00c2e7a3': 'Alpha Centauri Kid',
};

// State
let config = { blocklist: [], blocklist_names: [], allowlist: [], allowlist_overrides: {}, settings: {} };
let currentProfile = null;
let allHoldings = [];
let collectionData = {};
let autoRotateTimer = null;
let allCollectionsInfo = [];

// DOM
const handleInput = document.getElementById('handle-input');
const loadBtn = document.getElementById('load-btn');
const statusEl = document.getElementById('status');
const profileInfoEl = document.getElementById('profile-info');
const boardEl = document.getElementById('board');
const emptyStateEl = document.getElementById('empty-state');
const controlsEl = document.getElementById('controls');
const autoRotateToggle = document.getElementById('auto-rotate-toggle');
const collectionFilterGroup = document.getElementById('collection-filter-group');
const collectionSearch = document.getElementById('collection-search');
const addToAllowlistBtn = document.getElementById('add-to-allowlist');
const inputModeSelect = document.getElementById('input-mode');

// --- Init ---
async function init() {
  try {
    const resp = await fetch('collections.json');
    config = await resp.json();
  } catch (e) {
    console.warn('Could not load collections.json, using defaults');
  }

  // Preload all tracked collection names
  try {
    statusEl.textContent = 'Loading collection registry...';
    let page = 1;
    while (true) {
      const resp = await fetch(`${API_BASE}/xtdh/collections?page=${page}`);
      const data = await resp.json();
      allCollectionsInfo = allCollectionsInfo.concat(data.data || []);
      if (!data.next) break;
      page++;
    }
    statusEl.textContent = '';
  } catch (e) {
    console.warn('Could not preload collection registry', e);
  }

  // Check URL params
  const params = new URLSearchParams(window.location.search);
  const handle = params.get('handle');
  const wallet = params.get('wallet');
  if (handle) {
    handleInput.value = handle;
    loadProfile(handle);
  } else if (wallet) {
    handleInput.value = wallet;
    loadWallet(wallet);
  }

  // Event listeners
  loadBtn.addEventListener('click', () => {
    const val = handleInput.value.trim().replace(/^@/, '');
    if (!val) return;
    const mode = inputModeSelect ? inputModeSelect.value : 'handle';
    if (mode === 'wallet' || /^0x[a-fA-F0-9]{40}$/.test(val)) {
      updateURL(val, 'wallet');
      loadWallet(val);
    } else {
      updateURL(val, 'handle');
      loadProfile(val);
    }
  });

  handleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loadBtn.click();
  });

  if (inputModeSelect) {
    inputModeSelect.addEventListener('change', () => {
      if (inputModeSelect.value === 'wallet') {
        handleInput.placeholder = 'Enter wallet address (0x...)';
      } else {
        handleInput.placeholder = 'Enter 6529 handle (e.g. punk6529)';
      }
    });
  }

  autoRotateToggle.addEventListener('change', () => {
    if (autoRotateToggle.checked) {
      startAutoRotate();
    } else {
      stopAutoRotate();
    }
  });

  collectionSearch.addEventListener('input', () => {
    const val = collectionSearch.value.trim().toLowerCase();
    addToAllowlistBtn.disabled = !val;
  });

  addToAllowlistBtn.addEventListener('click', () => {
    const search = collectionSearch.value.trim().toLowerCase();
    if (!search) return;
    const matches = allCollectionsInfo.filter(c =>
      c.collection_name && c.collection_name.toLowerCase().includes(search)
    );
    if (matches.length === 0) {
      statusEl.textContent = `No collection matching "${search}"`;
      statusEl.className = 'status error';
      setTimeout(() => { statusEl.textContent = ''; statusEl.className = 'status'; }, 3000);
      return;
    }
    for (const m of matches) {
      const addr = m.contract.toLowerCase();
      if (!config.allowlist.includes(addr)) {
        config.allowlist.push(addr);
      }
    }
    if (currentProfile || Object.keys(collectionData).length > 0) {
      renderBoard();
    }
    collectionSearch.value = '';
    addToAllowlistBtn.disabled = true;
    statusEl.textContent = `Added ${matches.length} collection(s): ${matches.map(m => m.collection_name).join(', ')}`;
    statusEl.className = 'status';
    setTimeout(() => { statusEl.textContent = ''; }, 4000);
  });
}

function updateURL(value, type) {
  const url = new URL(window.location);
  url.searchParams.delete('handle');
  url.searchParams.delete('wallet');
  url.searchParams.set(type, value);
  window.history.pushState({}, '', url);
}

// --- Load via 6529 Profile Handle ---
async function loadProfile(handle) {
  loadBtn.disabled = true;
  statusEl.textContent = `Looking up @${handle}...`;
  statusEl.className = 'status loading';
  profileInfoEl.style.display = 'none';
  boardEl.innerHTML = '';
  emptyStateEl.style.display = 'none';
  controlsEl.style.display = 'none';
  stopAutoRotate();
  autoRotateToggle.checked = false;

  try {
    const idResp = await fetch(`${API_BASE}/identities/${handle}`);
    if (!idResp.ok) {
      throw new Error(`Handle "${handle}" not found`);
    }
    const identity = await idResp.json();
    currentProfile = identity;
    showProfileInfo(identity);

    statusEl.textContent = 'Fetching NFT holdings...';
    const ck = identity.consolidation_key;
    allHoldings = [];
    let page = 1;
    while (true) {
      const resp = await fetch(`${API_BASE}/nft-owners/consolidation/${ck}?page_size=100&page=${page}`);
      const data = await resp.json();
      allHoldings = allHoldings.concat(data.data || []);
      statusEl.textContent = `Fetching NFT holdings... ${allHoldings}/${data.count}`;
      if (!data.next) break;
      page++;
    }

    statusEl.textContent = `Found ${allHoldings.length} NFTs. Filtering PFPs...`;
    const byContract = groupByContract(allHoldings);
    const pfpCollections = filterPFPCollections(byContract);

    collectionData = {};
    for (const [contract, tokens] of Object.entries(pfpCollections)) {
      collectionData[contract] = await loadCollectionImages(contract, tokens, allHoldings);
    }

    controlsEl.style.display = 'flex';
    collectionFilterGroup.style.display = 'flex';
    renderBoard();
    statusEl.textContent = '';

  } catch (err) {
    statusEl.textContent = `Error: ${err.message}`;
    statusEl.className = 'status error';
    console.error(err);
  } finally {
    loadBtn.disabled = false;
  }
}

// --- Load via Raw Wallet Address ---
async function loadWallet(address) {
  loadBtn.disabled = true;
  statusEl.textContent = `Loading wallet ${address.slice(0, 8)}...${address.slice(-6)}...`;
  statusEl.className = 'status loading';
  profileInfoEl.style.display = 'none';
  boardEl.innerHTML = '';
  emptyStateEl.style.display = 'none';
  controlsEl.style.display = 'none';
  stopAutoRotate();
  autoRotateToggle.checked = false;

  try {
    // Show profile info if this wallet is a 6529 identity
    try {
      const idResp = await fetch(`${API_BASE}/identities/by-wallet/${address}`);
      if (idResp.ok) {
        const idData = await idResp.json();
        if (idData.handle || idData.display) {
          currentProfile = idData;
          showProfileInfo(idData);
        }
      }
    } catch (e) {
      // Not a 6529 identity, that's fine
    }

    if (!currentProfile) {
      // Show minimal profile info for non-6529 wallets
      profileInfoEl.innerHTML = `
        <div class="info-text">
          <div class="info-name">${formatAddress(address)}</div>
          <div class="info-stats">Raw wallet · on-chain lookup</div>
        </div>
      `;
      profileInfoEl.style.display = 'flex';
    }

    // Always use on-chain balanceOf checks for PFP contracts
    // The 6529 nft-owners endpoint doesn't track external PFP collections
    statusEl.textContent = 'Checking PFP collections on-chain...';
    allHoldings = await fetchWalletNFTsOnChain(address);

    statusEl.textContent = `Found ${allHoldings.length} PFPs. Loading images...`;
    const byContract = groupByContract(allHoldings);
    const pfpCollections = filterPFPCollections(byContract);

    collectionData = {};
    for (const [contract, tokens] of Object.entries(pfpCollections)) {
      collectionData[contract] = await loadCollectionImages(contract, tokens, allHoldings);
    }

    controlsEl.style.display = 'flex';
    collectionFilterGroup.style.display = 'flex';
    renderBoard();
    statusEl.textContent = '';

  } catch (err) {
    statusEl.textContent = `Error: ${err.message}`;
    statusEl.className = 'status error';
    console.error(err);
  } finally {
    loadBtn.disabled = false;
  }
}

// --- Fetch NFTs for a wallet via Alchemy API ---
async function fetchWalletNFTsOnChain(address) {
  const holdings = [];
  const alchemyKey = config.alchemy_api_key || 'demo';
  const alchemyBase = `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}/getNFTsForOwner`;
  
  console.log(`Querying Alchemy for ${address}`);
  
  let pageKey = null;
  let totalCount = 0;
  
  while (true) {
    let url = `${alchemyBase}?owner=${address}&pageSize=100`;
    if (pageKey) url += `&pageKey=${encodeURIComponent(pageKey)}`;
    
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Alchemy API error: ${resp.status}`);
    }
    const data = await resp.json();
    
    if (!totalCount) totalCount = data.totalCount || 0;
    
    for (const nft of data.ownedNfts || []) {
      const contract = (nft.contract?.address || '').toLowerCase();
      const tokenId = nft.id?.tokenId;
      if (!contract || !tokenId) continue;
      
      // Check if this is a known PFP collection
      if (contract in KNOWN_PFP_CONTRACTS) {
        const media = nft.media?.[0] || {};
        const img = media.gateway || media.thumbnail || '';
        holdings.push({
          contract,
          token_id: parseInt(tokenId, 16) || tokenId,
          balance: parseInt(nft.balance || '1'),
          image: img,
          name: nft.title || `#${tokenId}`,
          source: 'alchemy'
        });
      }
    }
    
    statusEl.textContent = `Scanned ${holdings.length} PFPs from ${totalCount} total NFTs...`;
    
    if (!data.pageKey) break;
    pageKey = data.pageKey;
  }
  
  console.log(`Found ${holdings.length} PFPs across ${new Set(holdings.map(h => h.contract)).size} collections`);
  return holdings;
}

function showProfileInfo(identity) {
  const pfp = identity.pfp || '';
  const display = identity.display || identity.handle || formatAddress(identity.primary_wallet || '');
  const level = identity.level || '?';
  const cic = identity.cic || 0;
  const walletCount = (identity.wallets || []).length;

  profileInfoEl.innerHTML = `
    ${pfp ? `<img src="${pfp}" alt="${display}" onerror="this.style.display='none'">` : ''}
    <div class="info-text">
      <div class="info-name">${display}</div>
      <div class="info-stats">Level ${level} · CIC ${cic.toLocaleString()} · ${walletCount} wallet${walletCount !== 1 ? 's' : ''}</div>
    </div>
  `;
  profileInfoEl.style.display = 'flex';
}

// --- Group & Filter ---
function groupByContract(holdings) {
  const grouped = {};
  for (const h of holdings) {
    const c = h.contract.toLowerCase();
    if (!grouped[c]) grouped[c] = [];
    grouped[c].push({
      token_id: h.token_id,
      balance: h.balance || 1
    });
  }
  return grouped;
}

function filterPFPCollections(byContract) {
  const result = {};

  for (const [contract, tokens] of Object.entries(byContract)) {
    const isBlocked = config.blocklist.includes(contract);
    const isAllowed = config.allowlist.includes(contract);

    if (isAllowed) {
      result[contract] = tokens;
      continue;
    }

    if (isBlocked) continue;

    // Only include known PFP collections
    const isPFP = contract in KNOWN_PFP_CONTRACTS;
    if (isPFP) {
      result[contract] = tokens;
    }
  }

  return result;
}

// --- Load Images ---
async function loadCollectionImages(contract, tokens, holdings) {
  const info = {
    name: KNOWN_PFP_CONTRACTS[contract] || '',
    tokens: [],
    displayIndex: 0
  };

  // Get collection name from preloaded xTDH data if available
  const collInfo = allCollectionsInfo.find(c => c.contract.toLowerCase() === contract);
  if (collInfo?.collection_name) {
    info.name = collInfo.collection_name;
  }
  if (!info.name) info.name = formatAddress(contract);

  if (holdings.some(h => h.image)) {
    // Images already provided by Alchemy
    info.tokens = tokens.map(t => {
      const h = holdings.find(h => h.contract === contract && h.token_id === t.token_id);
      return {
        id: t.token_id,
        name: h?.name || `#${t.token_id}`,
        image: h?.image || '',
        source: 'alchemy'
      };
    });
    return info;
  }

  // Try 6529 API for NFT metadata (works for 6529-indexed collections)
  try {
    const resp = await fetch(`${API_BASE}/nfts?contract=${contract}&page_size=101`);
    const data = await resp.json();

    if (data.data && data.data.length > 0) {
      const nftMap = {};
      for (const n of data.data) {
        nftMap[n.id] = n;
      }

      info.tokens = tokens.map(t => {
        const nft = nftMap[t.token_id];
        const img = nft?.thumbnail || nft?.image || '';
        return {
          id: t.token_id,
          name: nft?.name || `#${t.token_id}`,
          image: img,
          source: '6529'
        };
      });
      return info;
    }
  } catch (e) {
    console.warn(`6529 API failed for ${contract}`, e);
  }

  // External collection: fetch token images via on-chain tokenURI
  info.tokens = [];
  for (const t of tokens.slice(0, 20)) {
    try {
      const img = await fetchExternalImage(contract, t.token_id);
      info.tokens.push({
        id: t.token_id,
        name: `#${t.token_id}`,
        image: img,
        source: 'external'
      });
    } catch (e) {
      info.tokens.push({
        id: t.token_id,
        name: `#${t.token_id}`,
        image: '',
        source: 'failed'
      });
    }
  }

  return info;
}

async function fetchExternalImage(contract, tokenId) {
  const tokenURISig = '0xc87b56dd';
  const tokenIdHex = tokenId.toString(16).padStart(64, '0');
  const data = tokenURISig + tokenIdHex;

  const resp = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'eth_call',
      params: [{ to: contract, data }, 'latest'],
      id: 1,
      jsonrpc: '2.0'
    })
  });

  const json = await resp.json();
  const result = json.result;

  if (!result || result === '0x' || result.length < 3) {
    // Try ERC-1155 uri(uint256)
    const uriSig = '0x0e89341c';
    const resp2 = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'eth_call',
        params: [{ to: contract, data: uriSig + tokenIdHex }, 'latest'],
        id: 2,
        jsonrpc: '2.0'
      })
    });
    const json2 = await resp2.json();
    const result2 = json2.result;
    if (!result2 || result2 === '0x' || result2.length < 3) return '';
    return await resolveTokenURI(result2, tokenId);
  }

  return await resolveTokenURI(result, tokenId);
}

async function resolveTokenURI(hexResult, tokenId) {
  const hex = hexResult.slice(2);
  if (hex.length < 128) return '';
  const length = parseInt(hex.slice(64, 128), 16) * 2;
  const uriHex = hex.slice(128, 128 + length);
  const uri = hexToString(uriHex);

  if (!uri) return '';

  let metadataUrl = uri;
  if (uri.startsWith('ipfs://')) {
    const path = uri.replace('ipfs://', '');
    metadataUrl = IPFS_GATEWAY + path;
  } else if (uri.startsWith('ipfs/')) {
    metadataUrl = IPFS_GATEWAY + uri.replace('ipfs/', '');
  }

  if (/^\d+$/.test(uri)) {
    return '';
  }

  try {
    const resp = await fetch(metadataUrl);
    const metadata = await resp.json();
    let imgUrl = metadata.image || metadata.image_url || '';

    if (imgUrl.startsWith('ipfs://')) {
      imgUrl = IPFS_GATEWAY + imgUrl.replace('ipfs://', '');
    } else if (imgUrl.startsWith('ipfs/')) {
      imgUrl = IPFS_GATEWAY + imgUrl.replace('ipfs/', '');
    }

    return imgUrl;
  } catch (e) {
    console.warn(`Failed to fetch metadata from ${metadataUrl}`, e);
    return '';
  }
}

function hexToString(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return new TextDecoder().decode(bytes);
}

// --- Render ---
function renderBoard() {
  const contracts = Object.keys(collectionData);

  if (contracts.length === 0) {
    boardEl.innerHTML = '';
    emptyStateEl.style.display = 'block';
    return;
  }

  emptyStateEl.style.display = 'none';
  boardEl.innerHTML = '';

  contracts.sort((a, b) => {
    const aAllowed = config.allowlist.includes(a);
    const bAllowed = config.allowlist.includes(b);
    if (aAllowed && !bAllowed) return -1;
    if (!aAllowed && bAllowed) return 1;
    return (collectionData[a].name || '').localeCompare(collectionData[b].name || '');
  });

  for (const contract of contracts) {
    const coll = collectionData[contract];
    if (!coll.tokens || coll.tokens.length === 0) continue;
    const card = createCard(contract, coll);
    boardEl.appendChild(card);
  }
}

function createCard(contract, coll) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.contract = contract;

  if (config.allowlist.includes(contract)) {
    card.classList.add('in-allowlist');
  }

  const token = coll.tokens[coll.displayIndex] || coll.tokens[0];
  const totalTokens = coll.tokens.length;

  const imgContainer = document.createElement('div');
  imgContainer.className = 'card-image-container';

  if (token && token.image) {
    const img = document.createElement('img');
    img.src = token.image;
    img.alt = `${coll.name} #${token.id}`;
    img.loading = 'lazy';
    img.onerror = () => {
      imgContainer.innerHTML = `<div class="card-placeholder"><div class="ph-icon">🖼️</div>${coll.name}<br>#${token.id}</div>`;
    };
    imgContainer.appendChild(img);
  } else {
    imgContainer.innerHTML = `<div class="card-placeholder"><div class="ph-icon">🖼️</div>${coll.name}<br>#${token?.id || '?'}</div>`;
  }

  const info = document.createElement('div');
  info.className = 'card-info';
  info.innerHTML = `
    <div class="card-collection">${coll.name}</div>
    <div class="card-token">
      <span>#${token?.id || '?'}</span>
      <span class="card-counter">${coll.displayIndex + 1}/${totalTokens}</span>
    </div>
  `;

  const badge = document.createElement('div');
  badge.className = 'card-allowlist-badge';
  badge.textContent = '★';

  card.appendChild(imgContainer);
  card.appendChild(info);
  card.appendChild(badge);

  card.addEventListener('click', () => {
    if (totalTokens <= 1) return;
    coll.displayIndex = (coll.displayIndex + 1) % totalTokens;
    updateCard(card, coll);
  });

  return card;
}

function updateCard(card, coll) {
  const token = coll.tokens[coll.displayIndex];
  const totalTokens = coll.tokens.length;

  const imgContainer = card.querySelector('.card-image-container');
  if (token && token.image) {
    imgContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = token.image;
    img.alt = `${coll.name} #${token.id}`;
    img.onerror = () => {
      imgContainer.innerHTML = `<div class="card-placeholder"><div class="ph-icon">🖼️</div>${coll.name}<br>#${token.id}</div>`;
    };
    imgContainer.appendChild(img);
  } else {
    imgContainer.innerHTML = `<div class="card-placeholder"><div class="ph-icon">🖼️</div>${coll.name}<br>#${token?.id || '?'}</div>`;
  }

  const tokenInfo = card.querySelector('.card-token');
  tokenInfo.innerHTML = `
    <span>#${token?.id || '?'}</span>
    <span class="card-counter">${coll.displayIndex + 1}/${totalTokens}</span>
  `;
}

// --- Auto Rotate ---
function startAutoRotate() {
  const interval = (config.settings?.auto_rotate_seconds || 5) * 1000;
  autoRotateTimer = setInterval(() => {
    const cards = boardEl.querySelectorAll('.card');
    cards.forEach(card => {
      const contract = card.dataset.contract;
      const coll = collectionData[contract];
      if (!coll || coll.tokens.length <= 1) return;
      coll.displayIndex = (coll.displayIndex + 1) % coll.tokens.length;
      updateCard(card, coll);
    });
  }, interval);
}

function stopAutoRotate() {
  if (autoRotateTimer) {
    clearInterval(autoRotateTimer);
    autoRotateTimer = null;
  }
}

// --- Utils ---
function formatAddress(addr) {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

// Start
init();