// functions/[[path]].js
// 简化版本，参考示例风格

export default {
  async fetch(request, env) {
    // 验证 User-Agent
    const userAgent = request.headers.get('User-Agent');
    //if (!userAgent?.includes('MiniSkins')) {
    //  return new Response('Not Found', { status: 404 });
    //}

    // 解析 URL
    const url = new URL(request.url);
    const targetUrl = url.pathname.slice(1); // 去掉开头的 /
    
    if (!targetUrl) {
      return new Response('页面为空', { status: 400 });
    }

    // 验证目标 URL
    try {
      const targetURL = new URL(targetUrl);
      if (!['http:', 'https:'].includes(targetURL.protocol)) {
        return new Response('无效的URL', { status: 400 });
      }
      
      // 修改请求 URL，类似示例中的做法
      const newUrl = new URL(request.url);
      newUrl.href = targetURL.href;
      
      // 创建新请求
      const newRequest = new Request(newUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
      });

      // 发起请求并返回响应
      const response = await fetch(newRequest);
      
      // 添加 CORS 头
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      
      return newResponse;
      
    } catch (error) {
      return new Response('无效的URL', { status: 400 });
    }
  }
};
