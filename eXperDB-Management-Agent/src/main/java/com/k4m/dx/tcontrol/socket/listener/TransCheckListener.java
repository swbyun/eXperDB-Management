package com.k4m.dx.tcontrol.socket.listener;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.HashMap;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;

import com.k4m.dx.tcontrol.db.SqlSessionManager;
import com.k4m.dx.tcontrol.db.repository.service.SystemServiceImpl;
import com.k4m.dx.tcontrol.db.repository.service.TransServiceImpl;
import com.k4m.dx.tcontrol.db.repository.vo.DbServerInfoVO;
import com.k4m.dx.tcontrol.db.repository.vo.TransVO;
import com.k4m.dx.tcontrol.server.SocketExt;
import com.k4m.dx.tcontrol.socket.ProtocolID;
import com.k4m.dx.tcontrol.util.AES256;
import com.k4m.dx.tcontrol.util.AES256_KEY;
import com.k4m.dx.tcontrol.util.FileUtil;

/**
* @author 박태혁
* @see
* 
*      <pre>
* == 개정이력(Modification Information) ==
*
*   수정일       수정자           수정내용
*  -------     --------    ---------------------------
*  2018.04.23   박태혁 최초 생성
*      </pre>
*/
public class TransCheckListener extends Thread {

	// private SystemServiceImpl service;
	ApplicationContext context = null;
	private Logger socketLogger = LoggerFactory.getLogger("socketLogger");
	private Logger errLogger = LoggerFactory.getLogger("errorToFile");

	public TransCheckListener(ApplicationContext context) throws Exception {
		this.context = context;
	}

	@Override
	public void run() {
		int i = 0;
		socketLogger.info("Thread.interrupted() : " + Thread.interrupted());
		while (!Thread.interrupted()) {
			TransServiceImpl transService = (TransServiceImpl) context.getBean("TransService");

			try {
				TransVO searChTransVO = new TransVO();
				String strRealTimeChk = transService.transRealTimeCheck(searChTransVO);

				i++;

				try {
					Thread.sleep(3000);
				} catch (InterruptedException ex) {
					this.interrupt();
					continue;
				}

			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				transService = null;
			}
		}

	}

	private String selectConnectInfo(JSONObject serverInfoObj) throws Exception {

		SqlSessionFactory sqlSessionFactory = null;

		sqlSessionFactory = SqlSessionManager.getInstance();

		String poolName = "" + serverInfoObj.get(ProtocolID.SERVER_IP) + "_" + serverInfoObj.get(ProtocolID.DATABASE_NAME) + "_" + serverInfoObj.get(ProtocolID.SERVER_PORT);

		Connection connDB = null;
		SqlSession sessDB = null;

		String strMasterGbn = "";

		try {

			SocketExt.setupDriverPool(serverInfoObj, poolName);

			// DB 컨넥션을 가져온다.
			connDB = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + poolName);

			sessDB = sqlSessionFactory.openSession(connDB);

			HashMap hp = (HashMap) sessDB.selectOne("app.selectMasterGbm");

			strMasterGbn = (String) hp.get("master_gbn");
			
			sessDB.close();
			connDB.close();

		} catch (Exception e) {
			throw e;
		} finally {

			if(sessDB !=null) sessDB.close();
			if(connDB !=null) connDB.close();
		}

		return strMasterGbn;

	}

}